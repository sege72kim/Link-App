import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

import "./styles.css"

interface NotificationProps {
  isActive: boolean
  text: string
}

const Notification = ({ isActive, text }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const showNotification = () => {
    setIsVisible(true)

    setTimeout(() => {
      setIsVisible(false)
    }, 3000)
  }

  useEffect(() => {
    if (isActive) {
      showNotification()
    }
  }, [isActive])

  return (
    <div>
      <div className={`notification ${isVisible ? "show" : ""}`}>{text}</div>
    </div>
  )
}

export default Notification
