import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React, { type ChangeEvent, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

import type { UserFormItem } from "~/types/formData.ts"

import Modal from "../AddingModal/Modal"

import "./styles.css"

interface TaskProps extends UserFormItem {
  blockTitle: string
  blockSubTitle: string
  blockPrefix: string
  updateTaskData: (value: UserFormItem) => void
  deleteTask: (taskId: number) => void
}

function Task({
  id,
  item,
  pinned,
  keyType,
  title,
  blockTitle,
  blockSubTitle,
  blockPrefix,
  deleteTask,
  updateTaskData,
  modalActive,
  setModalActive
}: TaskProps & {
  modalActive: string
  setModalActive: React.Dispatch<React.SetStateAction<string>>
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const [input, setInput] = useState(title)
  const [input1, setInput1] = useState(item)

  useEffect(() => {
    if (!modalActive) {
      if (input !== title && input1 !== item) {
        updateTaskData({
          title: input,
          item: input1,
          pinned,
          id
        })
      }
    } else {
      setInput(title)
      setInput1(item)
    }
  }, [modalActive])

  const togglePin = () => {
    updateTaskData({
      title: input,
      item: input1,
      keyType,
      pinned: !pinned,
      id
    })
  }

  const handleDelete = () => {
    deleteTask(id)
  }

  const pinColor = pinned ? "blue" : "#707579"

  const style: React.CSSProperties = {
    transition: transition || undefined,
    transform: transform ? CSS.Transform.toString(transform) : undefined
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target
    if (blockTitle === "telegrams" || blockTitle === "socials") {
      value = value.replace(/[^a-zA-Z0-9_]/g, "")
      setInput1(`@${value}`)
    } else if (blockTitle === "phones") {
      value = value.replace(/[^0-9]/g, "")
      if (value.length <= 16) {
        setInput1(`+${value}`)
      }
    } else {
      value = value.replace(/[^a-zA-Z0-9_!*.();:@&=+$,/?#[\]-]/g, "")
      setInput1(value)
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="task">
      <div className="item_container">
        <div className="item_edit_container">
          <div className="left_part" onClick={() => setModalActive(title + id)}>
            <div className="item_title">{title}</div>
            <div className="item_url">{item}</div>
          </div>
          <div className="right_part">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="pin_img"
              onClick={togglePin}
            >
              <path
                d="M8.56927 5.88209L14.1179 11.4307L12.6564 18.3735C12.4379 19.4114 11.1559 19.8123 10.4173 19.0737L0.926329 9.58274C0.187716 8.84413 0.588615 7.56212 1.62653 7.34362L8.56927 5.88209Z"
                fill={pinColor}
              />
              <path
                d="M0 20L6.59657 15.253L4.74702 13.4034L0 20Z"
                fill={pinColor}
              />
              <path
                d="M12.3951 0.565689C12.8773 -0.104447 13.8365 -0.194279 14.4079 0.377176L19.6228 5.59205C20.1943 6.16351 20.1044 7.12271 19.4343 7.60495L14.1179 11.4307L8.56927 5.88209L12.3951 0.565689Z"
                fill={pinColor}
              />
            </svg>

            <img
              src="/images/sort.svg"
              alt=""
              {...listeners}
              className="sort_img"
            />
          </div>
        </div>
        <div className="fill_line" />
      </div>
      <Modal active={modalActive === title + id} setActive={setModalActive}>
        <div className="modal_top">
          <div>
            <div className="modal_top_line" />
            <div className="modal_top_text">{title}</div>
          </div>
        </div>
        <div className="modal_close" onClick={() => setModalActive("")}>
          <img src="/images/cross.svg" alt="+" />
        </div>
        <div className="modal_input_container">
          <input
            type="text"
            placeholder="Title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="fill_line_2" />
          <input
            type="text"
            placeholder={blockPrefix}
            value={input1}
            onChange={handleChange}
          />
        </div>
        <div className="modal_sub_text">{blockSubTitle}</div>
        <div className="delete_button" onClick={handleDelete}>
          <div>
            <FormattedMessage id="delete" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Task
