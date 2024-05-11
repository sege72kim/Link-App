import type { FC } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./StartPage.css"
import { Link } from "react-router-dom"
import { FormattedDate, FormattedMessage } from "react-intl"

export const StartPage: FC = () => {
  return (
    <Page title="Start Page">
      <div className="start_page">
        <img className="start_page_img" src="./images/logo_link.svg" />
        <div className="start_page_title">Links App</div>
        <div className="start_page_text">
          <FormattedMessage id="text_1" />
        </div>
        <Link to="/main">222</Link>
      </div>
    </Page>
  )
}
