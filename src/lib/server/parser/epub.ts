import { unzipSync } from 'fflate'
import { XMLParser } from 'fast-xml-parser'
import type {
    ContainerXML,
    PackageDocument,
    ParsedEPUB,
    Chapter,
    ManifestItem
} from './types'

/**
 * EPUB reader that parses and extracts content from EPUB files
 */
export class EpubReader {
    private zip: Record<string, Uint8Array>
    private parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
    })
    private opfPath!: string
    private metadata!: ParsedEPUB
    private manifestMap!: Map<string, ManifestItem>
    private chapters: Chapter[] = []
    private cover: string | null = null
    private tocMap: Map<string, string> = new Map()

    private constructor(zip: Record<string, Uint8Array>) {
        this.zip = zip
    }

    static async fromFile(file: File): Promise<EpubReader> {
        const buffer = await file.arrayBuffer()
        const zip = unzipSync(new Uint8Array(buffer))
        const book = new EpubReader(zip)
        await book.load()
        return book
    }

    private getTextValue(node: any): string {
        if (typeof node === 'string') return node
        if (Array.isArray(node)) return this.getTextValue(node[0])
        if (typeof node === 'object' && node !== null && '#text' in node) return node['#text']
        return 'Unknown'
    }

    /**
     * Formats chapter title by checking TOC first, then falling back to filename formatting
     */
    private formatChapterTitle(href: string, index: number): string {
        const normalizedHref = href.split('/').pop() || href
        
        // Check if we have a TOC title for this href
        for (const [tocHref, tocTitle] of this.tocMap.entries()) {
            const tocFilename = tocHref.split('/').pop()?.split('#')[0]
            const hrefFilename = normalizedHref.split('#')[0]
            if (tocFilename === hrefFilename) {
                return tocTitle
            }
        }
        
        // Fallback to filename-based formatting
        const filename = href.split('/').pop()?.replace(/\.(xhtml|html|xml)$/i, '') || ''
        
        if (/^\d+$/.test(filename)) {
            return `Chapter ${index + 1}`
        }
        
        let title = filename.replace(/[_-]/g, ' ')
        title = title.replace(/\b\w/g, (char) => char.toUpperCase())
        
        return title || `Chapter ${index + 1}`
    }

    /**
     * Parses EPUB table of contents from NCX (EPUB 2) or nav document (EPUB 3)
     */
    private parseToc(opf: PackageDocument) {
        const tocId = opf.package.spine['@_toc']
        
        // Try EPUB 2 NCX file
        if (tocId) {
            const ncxItem = this.manifestMap.get(tocId)
            if (ncxItem) {
                const ncxPath = this.resolveRelativePath(this.opfPath, ncxItem['@_href'])
                const ncxContent = this.zip[ncxPath]
                if (ncxContent) {
                    this.parseNcx(ncxContent, ncxPath)
                    return
                }
            }
        }
        
        // Try EPUB 3 nav document
        const navItem = [...this.manifestMap.values()].find(
            item => item['@_properties']?.includes('nav')
        )
        if (navItem) {
            const navPath = this.resolveRelativePath(this.opfPath, navItem['@_href'])
            const navContent = this.zip[navPath]
            if (navContent) {
                this.parseNavDocument(navContent, navPath)
            }
        }
    }

    /**
     * Parses NCX file for EPUB 2 table of contents
     */
    private parseNcx(content: Uint8Array, basePath: string) {
        try {
            const xml = this.decodeText(content)
            const ncx = this.parser.parse(xml)
            
            const navMap = ncx.ncx?.navMap
            if (!navMap) return
            
            const processNavPoint = (navPoint: any) => {
                if (!navPoint) return
                
                const navPoints = Array.isArray(navPoint) ? navPoint : [navPoint]
                for (const point of navPoints) {
                    const label = point.navLabel?.text || point.navLabel?.['#text']
                    const src = point.content?.['@_src']
                    
                    if (label && src) {
                        const href = this.resolveRelativePath(basePath, src).split('#')[0]
                        this.tocMap.set(href, label)
                    }
                    
                    if (point.navPoint) {
                        processNavPoint(point.navPoint)
                    }
                }
            }
            
            processNavPoint(navMap.navPoint)
        } catch (e) {
            console.error('Error parsing NCX:', e)
        }
    }

    /**
     * Parses HTML nav document for EPUB 3 table of contents
     */
    private parseNavDocument(content: Uint8Array, basePath: string) {
        try {
            const html = this.decodeText(content)
            const tocRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi
            let match
            
            while ((match = tocRegex.exec(html)) !== null) {
                const href = match[1]
                const title = match[2].trim()
                if (href && title) {
                    const fullHref = this.resolveRelativePath(basePath, href).split('#')[0]
                    this.tocMap.set(fullHref, title)
                }
            }
        } catch (e) {
            console.error('Error parsing nav document:', e)
        }
    }

    private async load() {
        // Parse container.xml to find OPF file
        const containerXml = this.decodeText(this.zip['META-INF/container.xml'])
        const container = this.parser.parse(containerXml) as ContainerXML
        this.opfPath = container.container.rootfiles.rootfile['@_full-path']

        // Parse OPF file
        const opfText = this.decodeText(this.zip[this.opfPath])
        const opf = this.parser.parse(opfText) as PackageDocument

        // Extract metadata
        const md = opf.package.metadata
        this.metadata = {
            title: this.getTextValue(md['dc:title']),
            author: this.getTextValue(md['dc:creator']),
            description: this.getTextValue(md['dc:description']),
            language: this.getTextValue(md['dc:language']),
            chapters: [],
        }

        // Build manifest map
        const items = Array.isArray(opf.package.manifest.item)
            ? opf.package.manifest.item
            : [opf.package.manifest.item]

        this.manifestMap = new Map(items.map(i => [i['@_id'], i]))

        // Parse table of contents
        this.parseToc(opf)

        // Extract cover image
        const metaArray = Array.isArray(md.meta) ? md.meta : [md.meta]
        const coverMeta = metaArray?.find(m => m?.['@_name'] === 'cover' && m?.['@_content'])
        if (coverMeta) {
            const coverId = coverMeta['@_content'] ?? ''
            const coverItem = this.manifestMap.get(coverId)
            if (coverItem) {
                this.cover = coverItem['@_href']
            } else {
                // Fallback: find an image that looks like a cover
                const coverCandidate = items.find(item =>
                    item['@_media-type'].startsWith('image/') &&
                    (item['@_id'].toLowerCase().includes('cover') ||
                        item['@_href'].toLowerCase().includes('cover'))
                ) || items.find(item => item['@_media-type'].startsWith('image/'))
                if (coverCandidate) {
                    this.cover = coverCandidate['@_href']
                }
            }
        }

        // Process spine to extract chapters
        const spine = opf.package.spine.itemref
        let chapterIndex = 0
        for (const item of spine) {
            const id = item['@_idref']
            const manifestItem = this.manifestMap.get(id)
            if (!manifestItem) continue

            const href = manifestItem['@_href']
            const path = this.resolveRelativePath(this.opfPath, href)
            const content = this.zip[path]
            if (!content) continue

            const html = this.decodeText(content)

            this.chapters.push({
                id,
                href: path,
                title: this.formatChapterTitle(href, chapterIndex),
                content: html,
            })
            chapterIndex++
        }

        this.metadata.chapters = this.chapters
    }

    getMetadata() {
        return this.metadata
    }

    getChapters(): Chapter[] {
        return this.chapters
    }

    getChapter(id: string): Chapter | undefined {
        return this.chapters.find(c => c.id === id)
    }

    getToc() {
        return this.chapters.map(c => ({ title: c.title, id: c.id, href: c.href }))
    }

    getCover(): string | null {
        return this.cover
    }

    getImages(): ManifestItem[] {
        return [...this.manifestMap.values()].filter(item =>
            item['@_media-type'].startsWith('image/')
        )
    }

    getResourceByHref(href: string): { data: Uint8Array; mediaType: string } | undefined {
        const item = [...this.manifestMap.values()].find((i) => i['@_href'] === href)
        if (!item) return undefined

        const path = this.resolveRelativePath(this.opfPath, item['@_href'])
        const data = this.zip[path]
        if (!data) return undefined

        return {
            data,
            mediaType: item['@_media-type'],
        }
    }

    private resolveRelativePath(base: string, relative: string): string {
        const baseDir = base.split('/').slice(0, -1).join('/')
        return baseDir ? `${baseDir}/${relative}` : relative
    }

    private decodeText(buf: Uint8Array): string {
        return new TextDecoder().decode(buf)
    }
}

export async function readBook(file: File) {
    return await EpubReader.fromFile(file)
}