import { useState, useEffect, useRef } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable"
import Modal from "../AddingModal/Modal"
import Task from "./Task"
import "./styles.css"

interface Item {
  id: number
  title: string
  url: string
}

interface Props {
  tasks: Item[]
  blocktitle: string
  blocksub: string
  handlePinClick: (
    title: string,
    url: string,
    pinArray: { title: string; url: string }[]
  ) => void
  pinArray: { title: string; url: string }[]
  prefixprop: string
}

export const EditBlock: React.FC<Props> = ({
  tasks,
  blocktitle,
  blocksub,
  handlePinClick,
  pinArray,
  prefixprop
}) => {
  const [tasks1, setTasks] = useState<Item[]>(tasks)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const getTaskPos = (id: number) => tasks1.findIndex((item) => item.id === id)

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id === over.id) return

    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id)
      const newPos = getTaskPos(over.id)

      return arrayMove(tasks, originalPos, newPos)
    })
  }

  const blockRef = useRef<HTMLDivElement>(null)

  const addTask = (title: string, url: string): void => {
    setTasks((tasks1: Item[]) => [
      ...tasks1,
      { id: tasks.length + 1, title, url }
    ])
  }

  useEffect(() => {
    const blockElement = blockRef.current

    const preventScroll = (event: TouchEvent) => {
      event.preventDefault()
    }

    if (blockElement) {
      blockElement.addEventListener("touchmove", preventScroll, {
        passive: false
      })

      return () => {
        blockElement.removeEventListener("touchmove", preventScroll)
      }
    }
  }, [])

  const [modalActive, setModalActive] = useState(false)

  const handleClick322 = () => {
    console.log({ tasks1 })
  }

  const [input, setInput] = useState("")
  const [input2, setInput2] = useState("")

  const handleSubmit = () => {
    if (!input || !input2) return

    addTask(input, input2)

    setInput("")
    setInput2("")
  }

  if (!tasks1 || tasks1.length === 0) {
    return (
      <div className="info_block_container_edit">
        <div className="block_title">{blocktitle}</div>
        <div className="info_block">
          <div className="item_container">
            <div className="add_button">
              <div className="plus">+</div>
              <div className="add">add</div>
            </div>
          </div>
        </div>
        <div className="info_subscription_2">
          <div>{blocksub}</div>
        </div>
      </div>
    )
  }

  if (tasks1.length < 5 && tasks1.length > 0) {
    return (
      <div className="info_block_container_edit">
        <div className="block_title">{blocktitle}</div>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="info_block" ref={blockRef}>
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              {tasks1.map((item) => (
                <div>
                  <Task
                    id={item.id}
                    title={item.title}
                    url={item.url}
                    key={item.id}
                    onPinClick={handlePinClick}
                    pinArray={pinArray}
                    blocksub={blocksub}
                    tasks={tasks1}
                    setTasks={setTasks}
                    type={blocktitle}
                    prefixprop={prefixprop}
                  />
                </div>
              ))}
            </SortableContext>
            <div className="item_container">
              <div className="add_button" onClick={() => setModalActive(true)}>
                <div className="plus">+</div>
                <div className="add">add</div>
              </div>
            </div>
          </div>
        </DndContext>

        <div className="info_subscription_2">
          <div>{blocksub}</div>
        </div>
        <Modal active={modalActive} setActive={setModalActive}>
          <div className="modal_top">
            <div>
              <div className="modal_top_line" />
              <div className="modal_top_text">{blocktitle}</div>
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
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
          </div>
          <div className="modal_sub_text">{blocksub}</div>
          <button onClick={handleSubmit} className="button">
            Add
          </button>
        </Modal>
        <button onClick={handleClick322}>222</button>
      </div>
    )
  } else {
    return (
      <div className="info_block_container_edit">
        <div className="block_title">{blocktitle}</div>
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="info_block">
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              {tasks1.map((item) => (
                <Task
                  id={item.id}
                  title={item.title}
                  url={item.url}
                  key={item.id}
                  onPinClick={handlePinClick}
                  pinArray={pinArray}
                  blocksub={blocksub}
                  tasks={tasks1}
                  setTasks={setTasks}
                  type={blocktitle}
                  prefixprop={prefixprop}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
        <div className="info_subscription_2">
          <div>{blocksub}</div>
        </div>
      </div>
    )
  }
}
