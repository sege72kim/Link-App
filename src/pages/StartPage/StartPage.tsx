import { FormattedMessage } from "react-intl"
import type { FC } from "react"

import "./StartPage.css"

export const StartPage: FC = () => {
  return (
    <div className="start_page">
      <img className="start_page_img" src="/images/logo_link.svg" alt="" />
      <div className="start_page_title">Links App</div>
      <div className="start_page_text">
        <FormattedMessage id="text_1" />
      </div>
    </div>
  )
}
