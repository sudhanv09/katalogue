export interface ContainerXML {
  container: {
    '@_version': string
    rootfiles: {
      rootfile: {
        '@_full-path': string
        '@_media-type': string
      }
    }
  }
}

export interface PackageDocument {
  package: {
    '@_version': string
    '@_xmlns': string
    metadata: OPFMetadata
    manifest: {
      item: ManifestItem[] | ManifestItem
    }
    spine: {
      '@_toc'?: string
      itemref: SpineItem[]
    }
  }
}

export interface OPFMetadata {
  'dc:title'?: string | string[]
  'dc:creator'?: string | OPFPerson | (string | OPFPerson)[]
  'dc:language'?: string
  'dc:description'?: string
  'dc:identifier'?: string | { '#text': string; '@_id': string }
  meta?: OPFMeta | OPFMeta[]
}

export interface OPFPerson {
  '#text': string
  '@_opf:role'?: string
  '@_opf:file-as'?: string
}

export interface OPFMeta {
  '@_name'?: string
  '@_content'?: string
  '@_property'?: string
  '#text'?: string
}

export interface ManifestItem {
  '@_id': string
  '@_href': string
  '@_media-type': string
  '@_properties'?: string
}

export interface SpineItem {
  '@_idref': string
  '@_linear'?: 'yes' | 'no'
}

export interface ParsedEPUB {
  title: string
  author: string
  description: string
  language: string
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  href: string
  title: string
  content: string
}
