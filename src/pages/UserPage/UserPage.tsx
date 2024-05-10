import type { FC } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./UserPage.css"

export const UserPage: FC = () => {
  const avatar =
    "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
  const nickname = "AkbarHodzha"
  const user_name = "@akma_228"
  return (
    <Page title="User Page">
      <div className="user_page">
        <div
          className="user_page_img"
          style={{
            backgroundImage: `url(${avatar})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%"
          }}
        >
          <div className="user_names_block">
            <div className="nickname">{nickname}</div>
            <div className="user_name">{user_name}</div>
          </div>
        </div>
        <div className="edit_button">Edit</div>
      </div>
    </Page>
  )
}
