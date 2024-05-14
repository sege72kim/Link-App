import { useIntl } from "react-intl"

import type { BlockProps } from "~/types/block.ts"
import type { UserFormItem } from "~/types/formData.ts"

import "./styles.css"

export function InfoBlock({ tasks, blockTitle, blockPrefix }: BlockProps) {
  const intl = useIntl()

  if (!tasks || tasks.length === 0) return null

  const renderTaskItem = (item: UserFormItem) => {
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
            <div className="item_url">
              {blockPrefix}
              {item.item}
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
