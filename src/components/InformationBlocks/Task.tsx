import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import "./styles.css"

import { useState, useEffect } from "react"
import Modal from "../AddingModal/Modal"
interface Task {
  id: number
  title: string
  url: string
}
interface TaskProps {
  id: number
  title: string
  url: string
  blocksub: string
  onPinClick: (
    id: number,
    title: string,
    url: string,
    pinArray: { id: number; title: string; url: string }[]
  ) => void
  pinArray: { id: number; title: string; url: string }[]
  tasks: Task[] // добавляем тип для исходного массива задач
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  type: string
  prefixprop: string
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  url,
  onPinClick,
  pinArray,
  blocksub,
  tasks,
  setTasks,
  type,
  prefixprop
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const isPinned = pinArray.some(
    (item) => item.title === title && item.url === url
  )
  const [isPinActive, setIsPinActive] = useState(isPinned)

  useEffect(() => {
    setIsPinActive(isPinned)
  }, [pinArray, isPinned])

  const togglePinColor = () => {
    if (isPinActive) {
      const updatedPins = pinArray.filter(
        (item) => !(item.title === title && item.url === url)
      )
      onPinClick(id, title, url, updatedPins)
    } else {
      setIsPinActive((prev) => !prev)
      onPinClick(id, title, url, [...pinArray, { id, title, url }])
    }
  }
  const [input, setInput] = useState(title)
  const [input2, setInput2] = useState(url)
  const handleSubmit = () => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, title: input, url: input2 }
      }
      return task
    })
    setTasks(updatedTasks)
  }
  const pinColor = isPinActive ? "blue" : "#707579"

  const style: React.CSSProperties = {
    transition: transition || undefined,
    transform: transform ? CSS.Transform.toString(transform) : undefined
  }
  const [modalActive, setModalActive] = useState(false)
  return (
    <div ref={setNodeRef} style={style} {...attributes} className="task">
      <div className="item_container">
        <div className="item_edit_container">
          <div className="left_part" onClick={() => setModalActive(true)}>
            <div className="item_title">{title}</div>
            <div className="item_url">
              {prefixprop}
              {url}
            </div>
          </div>
          <div className="right_part">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="pin_img"
              onClick={togglePinColor}
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
              src="./images/sort.svg"
              alt=""
              {...listeners}
              className="sort_img"
            />
          </div>
        </div>
        <div className="fill_line" />
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <div className="modal_top">
          <div>
            <div className="modal_top_line" />
            <div className="modal_top_text">{type}</div>
          </div>
        </div>
        <div className="modal_close" onClick={() => setModalActive(false)}>
          <img src="./images/cross.svg" alt="+" />
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
            placeholder="t.me/"
            value={prefixprop + input2}
            onChange={(e) => {
              const userInput = e.target.value.slice(prefixprop.length)
              setInput2(userInput)
            }}
          />
        </div>
        <div className="modal_sub_text">{blocksub}</div>
        <button onClick={handleSubmit} className="button">
          Add
        </button>
      </Modal>
    </div>
  )
}

export default Task
