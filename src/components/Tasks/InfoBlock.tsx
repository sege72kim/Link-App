// eslint-disable-next-line no-duplicate-imports
import type { FC} from "react"
import "./Page.css"
import { FormattedMessage } from "react-intl"

export const InfoBlock: FC = () => {
  return (
    <div className="info_block">
      <div className="left_info_block">
        <div className="time_remain">
            Осталось ждать
        </div>
        <div className="timer">
            20:31
        </div>
      </div>
      <div className="right_info_block">
        <div className="time_remain">
            В очереди
        </div>
        <div className="timer">
            3
        </div>
      </div>
    </div>
  )
}
