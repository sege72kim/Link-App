// eslint-disable-next-line no-duplicate-imports
import type { FC} from "react"
import "./Page.css"
import { FormattedMessage } from "react-intl"

export const Header: FC = () => {
  return (
    <div className="header">
      <div className="up_title">
        <FormattedMessage id="winner"/>
      </div>
      <div className="ton_ammount">
        100 TON
      </div>
      <div className="kurs">
        100 TON = 272 USD
      </div>
    </div>
  )
}
