import { useIntl } from "react-intl"

import type { BlockProps } from "~/types/block.ts"

import "./styles.css"

export function InfoBlock({ tasks, blockTitle, blockPrefix }: BlockProps) {
  const intl = useIntl()

  if (!tasks || tasks.length === 0) return null

  return (
    <div className="info_block_container">
      <div className="block_title">
        {intl.formatMessage({ id: `block_${blockTitle}` })}
      </div>
      <div className="info_block">
        {tasks.map((item) => (
          <div key={item.id} className="item_container">
            <div className="item_title">{item.title}</div>
            <div className="item_url">
              {blockPrefix}
              {item.item}
            </div>
            <div className="fill_line" />
          </div>
        ))}
      </div>
      <div className="info_subscription_2">
        <div>{intl.formatMessage({ id: `sub_block_${blockTitle}` })}</div>
      </div>
    </div>
  )
}
