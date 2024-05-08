// eslint-disable-next-line no-duplicate-imports
import type { FC} from "react"
import "./Page.css"
import { FormattedMessage } from "react-intl"

export const ButtonInfo: FC = () => {
  return (
    <div className="info_button">
        <img alt=""/>
        <div className="button_text"><FormattedMessage id="button_text"/></div>
    </div>
  )
}
