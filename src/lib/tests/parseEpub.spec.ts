import { readBook } from '$lib/server/parser/epub'
import { readFile } from "fs/promises"
import { describe, it, expect, beforeAll } from 'vitest';


describe('OPF parsing', () => {
    let file: File

    beforeAll(async () => {
        const buffer = await readFile(__dirname + '/blindsight.epub')
        file = new File([buffer], 'blindsight.epub', { type: 'application/epub+zip' })
    })

    it('get title and author', async () => {
        const book = await readBook(file)
        const metadata = book.getMetadata()

        expect(metadata.title).toBe('Blindsight')
        expect(metadata.author).toBe('Peter Watts')
        expect(metadata.language).toBe('en')
    })

    it('parses chapters correctly', async () => {
        const book = await readBook(file)
        const chapters = book.getChapters()

        expect(chapters).toHaveLength(15)
        expect(chapters[0]).toMatchObject({
            id: 'cover',
            href: expect.stringContaining('cover.xml'),
            title: expect.stringContaining('cover.xml')
        })
        expect(chapters[1]).toMatchObject({
            id: 'titlepage',
            href: expect.stringContaining('title.xml'),
            title: expect.stringContaining('title.xml')
        })
    })

    it('parses table of contents correctly', async () => {
        const book = await readBook(file)
        const toc = book.getToc()

        expect(toc).toHaveLength(15)
        expect(toc[0]).toMatchObject({
            id: 'cover',
            title: expect.stringContaining('cover.xml')
        })
        expect(toc[1]).toMatchObject({
            id: 'titlepage',
            title: expect.stringContaining('title.xml')
        })
    })

    it('retrieves specific chapter by id', async () => {
        const book = await readBook(file)
        const chapter = book.getChapter('main0')

        expect(chapter).toBeDefined()
        expect(chapter).toMatchObject({
            id: 'main0',
            href: expect.stringContaining('main0.xml'),
            title: expect.stringContaining('main0.xml')
        })
    })

    it('handles missing chapter gracefully', async () => {
        const book = await readBook(file)
        const chapter = book.getChapter('nonexistent')

        expect(chapter).toBeUndefined()
    })

    it('static assets', async () => {
        const book = await readBook(file)
        const images = book.getImages()

        expect(images.length).toBeGreaterThan(0)
        expect(images[0]['@_id']).toBe('logo-feedbooks-tiny')
        expect(images[0]['@_href']).toBe('images/logo-feedbooks-tiny.png')
    })
})
