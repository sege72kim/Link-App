import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import type { BlockProps } from "~/types/block.ts"
import type { UserFormItem } from "~/types/formData.ts"

import Modal from "../AddingModal/Modal"

import "./styles.css"

import Task from "./Task"

export function EditBlock({
  tasks,
  blockTitle,
  blockPrefix,
  updateData,
  modalActive,
  setModalActive
}: BlockProps & {
  modalActive: string
  setModalActive: React.Dispatch<React.SetStateAction<string>>
}) {
  const intl = useIntl()
  const [tasks1, setTasks] = useState<UserFormItem[]>(tasks)
  const blockRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    const blockElement = blockRef.current
    const preventScroll = (event: TouchEvent) => event.preventDefault()

    blockElement?.addEventListener("touchmove", preventScroll, {
      passive: false
    })

    return () => blockElement?.removeEventListener("touchmove", preventScroll)
  }, [])

  useEffect(() => {
    if (updateData) {
      updateData({ [blockTitle]: tasks1 })
    }
  }, [tasks1])

  const updateTaskData = (value: UserFormItem) => {
    if (updateData) {
      updateData({
        [blockTitle]: tasks1.map((item) =>
          item.id === value.id ? value : item
        )
      })
    }
  }

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleDragEnd = ({ active, over }: any) => {
    if (active.id !== over.id) {
      setTasks((prevState) => {
        const originalPos = prevState.findIndex((item) => item.id === active.id)
        const newPos = prevState.findIndex((item) => item.id === over.id)
        return arrayMove(prevState, originalPos, newPos)
      })
    }
  }

  const [input, setInput] = useState("")
  const [input1, setInput1] = useState("")

  useEffect(() => {
    if (!modalActive) {
      if (input && input1) {
        const newTask = {
          id: tasks1.length ? tasks1[tasks1.length - 1].id + 1 : 0,
          title: input,
          item: input1,
          pinned: false
        }
        setTasks((prevState) => [...prevState, newTask])
        setInput("")
        if (blockTitle === "phones") {
          setInput1("+")
        } else if (blockTitle === "telegrams" || blockTitle === "socials") {
          setInput1("@")
        } else {
          setInput1("")
        }
      }
    }
  }, [modalActive])

  useEffect(() => {
    if (blockTitle === "phones") {
      setInput1("+")
    } else if (blockTitle === "telegrams" || blockTitle === "socials") {
      setInput1("@")
    } else {
      setInput1("")
    }
  }, [blockTitle])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (blockTitle === "phones") {
      if (/^[0-9+]*$/.test(value) && value.length <= 15 && value.length >= 1) {
        setInput1(value)
      }
    } else if (blockTitle === "telegrams" || blockTitle === "socials") {
      if (!/\s/.test(value) && value.length >= 1) {
        setInput1(value)
      }
    } else {
      if (!/\s/.test(value)) {
        setInput1(value)
      }
    }
  }

  const renderAddButton = () => {
    if ((tasks1.length !== 5 || tasks1.length < 5) && blockTitle !== "main") {
      return (
        <div
          className="item_container"
          onClick={() => setModalActive(blockTitle)}
        >
          <div className="add_button">
            <div className="plus">+</div>
            <FormattedMessage id="add" />
          </div>
        </div>
      )
    }
  }
  const renderBlockContent = () => {
    if (!tasks1.length) {
      return <div className="info_block">{renderAddButton()}</div>
    }

    return (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="info_block">
          <SortableContext
            items={tasks1}
            strategy={verticalListSortingStrategy}
          >
            {tasks1.map((item) => (
              <Task
                key={item.id}
                id={item.id}
                title={item.title}
                item={item.item}
                blockSubTitle={intl.formatMessage({
                  id: `sub_block_${blockTitle}`
                })}
                blockTitle={blockTitle}
                blockPrefix={blockPrefix}
                updateTaskData={updateTaskData}
                deleteTask={deleteTask} // Передаем функцию deleteTask
                modalActive={modalActive}
                setModalActive={setModalActive}
              />
            ))}
            {renderAddButton()}
          </SortableContext>
        </div>
      </DndContext>
    )
  }
  if (blockTitle === "main" && !tasks1.length) {
    return <></>
  } else {
    return (
      <div className="info_block_container_edit" ref={blockRef}>
        {" "}
        <div className="block_title">
          {intl.formatMessage({ id: `block_${blockTitle}` })}
        </div>
        {renderBlockContent()}
        <div className="info_subscription_2">
          <div>{intl.formatMessage({ id: `sub_block_${blockTitle}` })}</div>
        </div>
        <Modal active={modalActive === blockTitle} setActive={setModalActive}>
          <div className="modal_top">
            <div>
              <div className="modal_top_line" />
              <div className="modal_top_text">{blockTitle}</div>
            </div>
          </div>
          <div
            className="modal_close"
            onClick={() => {
              setInput("")
              setInput1("")

              setModalActive("false")
            }}
          >
            <img src="/images/cross.svg" alt="Close" />
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
          <div className="modal_sub_text">
            {intl.formatMessage({ id: `sub_block_${blockTitle}` })}
          </div>
        </Modal>
      </div>
    )
  }
}
