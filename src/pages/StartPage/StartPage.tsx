import type { FC } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./StartPage.css"
import { Link } from "react-router-dom"

export const StartPage: FC = () => {
  return (
    <Page title="Start Page">
      <div className="start_page">
        <img className="start_page_img" src="./images/logo_link.svg" />
        <div className="start_page_title">Links App</div>
        <div className="start_page_text">
          Make your social media profile better right now. Create a Telegram
          Mini App by yourself in just a couple of minutes, no designers or
          programmers needed.
        </div>
        <Link to="/main">222</Link>
      </div>
    </Page>
  )
}
