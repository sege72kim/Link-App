import { postEvent, Utils } from "@tma.js/sdk"
import { useIntl } from "react-intl"

import type { BlockProps } from "~/types/block.ts"
import type { UserFormItem } from "~/types/formData.ts"

import "./styles.css"

const utils = new Utils("7.0", () => Math.random().toString(), postEvent)
export function InfoBlock({ tasks, blockTitle, showNotification }: BlockProps) {
  const intl = useIntl()

  if (!tasks || tasks.length === 0) return null
  const renderTaskItem = (item: UserFormItem) => {
    const shortenUrl = (url: string) => {
      if (item.keyType === "socials" || item.keyType === "links") {
        const regex = /^(?:https?:\/\/)?(?:www\.)?(.*)$/
        const match = url.match(regex)
        if (match && match.length > 1) {
          return match[1]
        }
      } else if (item.keyType === "telegrams") {
        return `@${url}`
      } else return url
    }
    const urlClick = (url: string) => {
      if (item.keyType === "telegrams") {
        utils.openTelegramLink(`https://t.me/${url}`)
      } else if (item.keyType === "wallets") {
        utils.openLink(`https://tonviewer.com/${url}`)
      } else if (item.keyType === "phones" || item.keyType === "mails") {
        navigator.clipboard.writeText(url)
        if (showNotification) {
          showNotification(intl.formatMessage({ id: `notification_1` }))
        }
      } else {
        utils.openLink(url)
      }
    }
    return (
      <div key={item.id} className="item_container">
        {item.text ? (
          <>
            <div className="item_title">
              {intl.formatMessage({ id: "block_About" })}
            </div>
            <div className="item_text">{item.text}</div>
          </>
        ) : (
          <>
            <div className="item_title">{item.title}</div>
            <div className="item_url" onClick={() => urlClick(item.item)}>
              {shortenUrl(item.item)}
            </div>
          </>
        )}
        <div className="fill_line" />
      </div>
    )
  }

  return (
    <div className="info_block_container">
      <div className="block_title">
        {intl.formatMessage({ id: `block_${blockTitle}` })}
      </div>
      <div className="info_block">{tasks.map(renderTaskItem)}</div>
    </div>
  )
}
