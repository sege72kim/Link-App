import { useIntl } from "react-intl"

import type { AboutProps } from "~/types/block.ts"

import "./styles.css"

export function AboutBlock({ text }: AboutProps) {
  const intl = useIntl()

  if (!text) return null
  else {
    return (
      <div className="info_block_container">
        <div className="block_title">
          {intl.formatMessage({ id: `block_About` })}
        </div>
        <div className="info_block">
          <div className="item_container">
            <div className="item_title">{text}</div>
          </div>
        </div>
      </div>
    )
  }
}
