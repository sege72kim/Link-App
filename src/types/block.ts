import type { UserFormItem } from "~/types/formData.ts"

export interface BlockProps {
  tasks: UserFormItem[]
  text?: string
  blockTitle: string
  blockPrefix: string
  updateData?: (value: object) => void
}

export interface AboutProps {
  text: string
  pinned?: boolean
}
