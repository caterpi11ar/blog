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

export type SocialIcons = {
  [social in SocialMedia]: string;
}

export type SocialMedia
  = | 'Github'
    | 'Facebook'
    | 'Instagram'
    | 'LinkedIn'
    | 'Mail'
    | 'Twitter'
    | 'Twitch'
    | 'YouTube'
    | 'WhatsApp'
    | 'Snapchat'
    | 'Pinterest'
    | 'TikTok'
    | 'CodePen'
    | 'Discord'
    | 'GitLab'
    | 'Reddit'
    | 'Skype'
    | 'Steam'
    | 'Telegram'
    | 'Mastodon'
    | 'bilibili'
    | 'leetcode'
