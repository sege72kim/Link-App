import {
  createNavigator,
  useBackButtonIntegration,
  useNavigatorIntegration
} from "@tma.js/react-router-integration"
import { useBackButton } from "@tma.js/sdk-react"
import { type FC, useMemo } from "react"
import { IntlProvider } from "react-intl"
import { Navigate, Route, Router, Routes } from "react-router-dom"

import { TokenProvider } from "~/contexts/Token.tsx"
import { LOCALES } from "~/i18n/locales.ts"
import { messages } from "~/i18n/messages.ts"
import { routes } from "~/navigation/routes.tsx"

export const App: FC = () => {
  const tmaNavigator = useMemo(createNavigator, [])
  const [location, nav] = useNavigatorIntegration(tmaNavigator)
  const backButton = useBackButton()

  useBackButtonIntegration(tmaNavigator, backButton)

  const locale = navigator.language === "ru" ? LOCALES.RUSSIAN : LOCALES.ENGLISH

  return (
    <TokenProvider>
      <IntlProvider messages={messages[locale]} locale="en" defaultLocale="en">
        <Router location={location} navigator={nav}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </IntlProvider>
    </TokenProvider>
  )
}
