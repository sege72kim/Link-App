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
import React, { useEffect, useRef, useState } from "react"
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
        setInput1("")
      }
    }
  }, [modalActive])

  const renderBlockContent = () => {
    if (!tasks1.length) {
      return (
        <div className="info_block">
          <div
            className="item_container"
            onClick={() => setModalActive(blockTitle)}
          >
            <div className="add_button">
              <div className="plus">+</div>
              <FormattedMessage id="add" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext items={tasks1} strategy={verticalListSortingStrategy}>
          {tasks1.map((item) => (
            <Task
              key={item.id}
              id={item.id}
              title={item.title}
              item={item.item}
              blockSubTitle={intl.formatMessage({
                id: `sub_block_${blockTitle}`
              })}
              blockPrefix={blockPrefix}
              updateTaskData={updateTaskData}
              modalActive={modalActive}
              setModalActive={setModalActive}
            />
          ))}
          <div
            className="item_container"
            onClick={() => setModalActive(blockTitle)}
          >
            <div className="add_button">
              <div className="plus">+</div>
              <FormattedMessage id="add" />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <div className="info_block_container_edit">
      <div className="block_title">
        {intl.formatMessage({ id: `block_${blockTitle}` })}
      </div>
      {renderBlockContent()}
      <div className="info_subscription_2">
        <div>{intl.formatMessage({ id: `sub_block_${blockTitle}` })}</div>
      </div>
      <Modal active={modalActive === blockTitle} setActive={setModalActive}>
        <div className="modal_top">
          <div className="modal_top_line" />
          <div className="modal_top_text">{blockTitle}</div>
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
            <input
              type="text"
              placeholder={blockPrefix}
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
