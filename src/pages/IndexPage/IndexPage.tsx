import type { FC } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./IndexPage.css"
import { Link } from "react-router-dom"
import { StartPage } from "../StartPage/StartPage"

export const IndexPage: FC = () => {
  return (
    <Page title="Start Page">
      <StartPage />
    </Page>
  )
}
