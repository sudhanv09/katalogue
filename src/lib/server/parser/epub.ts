import { unzipSync } from 'fflate'
import { XMLParser } from 'fast-xml-parser'
import type {
    ContainerXML,
    PackageDocument,
    ParsedEPUB,
    Chapter,
    ManifestItem
} from './types'

class Book {
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

    private constructor(zip: Record<string, Uint8Array>) {
        this.zip = zip
    }

    static async fromFile(file: File): Promise<Book> {
        const buffer = await file.arrayBuffer()
        const zip = unzipSync(new Uint8Array(buffer))
        const book = new Book(zip)
        await book.load()
        return book
    }

    private getTextValue(node: any): string {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return this.getTextValue(node[0]);
        if (typeof node === 'object' && node !== null && '#text' in node) return node['#text'];
        return 'Unknown';
    }

    private async load() {
        // Parse container.xml to find .opf
        const containerXml = this.decodeText(this.zip['META-INF/container.xml'])
        const container = this.parser.parse(containerXml) as ContainerXML
        this.opfPath = container.container.rootfiles.rootfile['@_full-path']

        // Parse .opf
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

        // Manifest map
        const items = Array.isArray(opf.package.manifest.item)
            ? opf.package.manifest.item
            : [opf.package.manifest.item]

        this.manifestMap = new Map(items.map(i => [i['@_id'], i]))

        // get cover
        const metaArray = Array.isArray(md.meta) ? md.meta : [md.meta]
        const coverMeta = metaArray?.find(m => m?.['@_name'] === 'cover' && m?.['@_content'])
        if (coverMeta) {
            const coverId = coverMeta['@_content'] ?? ''
            const coverItem = this.manifestMap.get(coverId)
            if (coverItem) {
                this.cover = coverItem['@_href']
            }
        }

        // Spine to chapters
        const spine = opf.package.spine.itemref
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
                title: href,
                content: html,
            })
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
        return this.chapters.map(c => ({ title: c.title, id: c.id }))
    }

    getCss(): ManifestItem[] {
        return [...this.manifestMap.values()].filter(item =>
            item['@_media-type'] === 'text/css'
        )
    }

    getImages(): ManifestItem[] {
        return [...this.manifestMap.values()].filter(item =>
            item['@_media-type'].startsWith('image/')
        )
    }

    getCover(): string | null {
        return this.cover
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
    return await Book.fromFile(file)
}