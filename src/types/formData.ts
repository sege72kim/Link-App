export interface UserFormItem {
  id: number
  title: string
  item: string
  pinned?: boolean
}

export interface UserFormData {
  userId: number
  image: string
  name: string
  username: string
  about: {
    text: string
    pinned?: boolean
  }
  telegrams: UserFormItem[]
  socials: UserFormItem[]
  links: UserFormItem[]
  phones: UserFormItem[]
  mails: UserFormItem[]
  wallets: UserFormItem[]
}

// @ts-ignore
export const defaultUserFormData: UserFormData = {
  about: {
    text: ""
  },
  telegrams: [],
  socials: [],
  links: [],
  phones: [],
  mails: [],
  wallets: []
}
