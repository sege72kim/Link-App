import type { FC } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./UserPage.css"

export const UserPage: FC = () => {
  return (
    <Page title="User Page">
      <div className="user_page">
        <img src="./images/image.png" />
      </div>
    </Page>
  )
}
