import React, { type ReactNode } from "react"

import "./ModalStyle.css"

interface ModalProps {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<string>>
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ active, setActive, children }) => {
  return (
    <div
      className={active ? "modal active" : "modal"}
      onClick={() => setActive("")}
    >
      <div
        className={active ? "modal_content active" : "modal_content"}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
