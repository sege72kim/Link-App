import { useMainButton } from "@tma.js/sdk-react"
import { useTonConnectUI } from "@tonconnect/ui-react"
// eslint-disable-next-line no-duplicate-imports
import type { FC, PropsWithChildren, ReactNode } from "react"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import "./Page.css"

export interface PageProps extends PropsWithChildren {
  // eslint-disable-next-line react/no-unused-prop-types
  title: string
  disclaimer?: ReactNode
}

export const Page: FC<PageProps> = ({
                                      children,
                                      disclaimer
                                    }) => {
  const intl = useIntl()

  const [tonConnectUI] = useTonConnectUI()
  const mainButton = useMainButton()

  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    const use = async () => {
      if (!tonConnectUI.connected) {
        await tonConnectUI.openModal()
      } else {
        tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 180,
          messages: [
            {
              address: import.meta.env.VITE_ADRESS,
              amount: "1000000",
              payload: 'te6ccsEBAQEAHwAAADoAAAAAV0UgV0FOTkEgTk9UQ09JTiBMSVNUSU5HITnGM2s='
            }
          ]
        })
          .then(() => setIsSent(true))
          .catch(() => setIsSent(false))
      }
    }

    if (tonConnectUI.connected) {
      mainButton.setText(intl.formatMessage({ id: "sign" }))
      mainButton.enable()
    } else if (isSent) {
      mainButton.setText(intl.formatMessage({ id: "thanks" }))
      mainButton.disable()
    } else {
      mainButton.setText(intl.formatMessage({ id: "connect_wallet" }))
      mainButton.enable()
    }

    mainButton.show()

    mainButton.on("click", use)
    return () => mainButton.off("click", use)
  }, [tonConnectUI.connected, isSent])

  return (
    <div className="page">
      {disclaimer && <div className="page__disclaimer">{disclaimer}</div>}
      {children}
    </div>
  )
}
