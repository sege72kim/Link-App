import type { UserFormItem } from "~/types/formData.ts"

export interface BlockProps {
  tasks: UserFormItem[]
  blockTitle: string
  blockPrefix: string
  updateData?: (value: object) => void
}
