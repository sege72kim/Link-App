import { useIntl } from "react-intl"

import type { BlockProps } from "~/types/block.ts"

import "./styles.css"

export function InfoBlock({ tasks, blockTitle }: BlockProps) {
  const intl = useIntl()

  if (!tasks || tasks.length === 0) return null
  if (blockTitle === "Main") {
    return (
      <div className="info_block_container">
        <div className="block_title">
          {intl.formatMessage({ id: `block_${blockTitle}` })}
        </div>
        <div className="info_block">
          {tasks.map((item) => (
            <div key={item.id} className="item_container">
              {item.text ? (
                <>
                  <div className="item_title">
                    {intl.formatMessage({ id: "block_About" })}
                  </div>
                  <div className="item_text">{item.text}</div>
                  <div className="fill_line" />
                </>
              ) : (
                <>
                  <div className="item_title">{item.title}</div>
                  <div className="item_url">{item.item}</div>
                  <div className="fill_line" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className="info_block_container">
        <div className="block_title">
          {intl.formatMessage({ id: `block_${blockTitle}` })}
        </div>
        <div className="info_block">
          {tasks.map((item) => (
            <div key={item.id} className="item_container">
              <div className="item_title">{item.title}</div>
              <div className="item_url">{item.item}</div>
              <div className="fill_line" />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
