import type { SocialMedia } from '@components/Socials/socialIcons'

export interface Site {
  website: string
  author: string
  desc: string
  title: string
  ogImage?: string
  lightAndDarkMode: boolean
  postPerPage: number
}

export type SocialObjects = Array<{
  name: SocialMedia
  href: string
  active: boolean
  linkTitle: string
}>
