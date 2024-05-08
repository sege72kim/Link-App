import type { FC } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./IndexPage.css" // Assuming your CSS file
import { Header } from "~/components/Tasks/Header"
import { InfoBlock } from "~/components/Tasks/InfoBlock"
import { ButtonInfo } from "~/components/Tasks/ButtonInfo"
export const IndexPage: FC = () => {

  return (
    <Page title="Not meme. Group access">
      <Header/>
      <InfoBlock/>
      <ButtonInfo/>
      
    </Page>
  )
}
