import type { ComponentType, JSX } from "react"

import { IndexPage } from "~/pages/IndexPage/IndexPage"
import { UserPage } from "~/pages/UserPage/UserPage"

interface Route {
  path: string
  Component: ComponentType
  title?: string
  icon?: JSX.Element
}

export const routes: Route[] = [
  {
    path: "/",
    Component: IndexPage
  },
  {
    path: "/main",
    Component: UserPage
  }
]
