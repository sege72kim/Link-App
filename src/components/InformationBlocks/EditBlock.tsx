import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import React, { type ChangeEvent, useEffect, useRef, useState } from "react"
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
  setModalActive,
  lastPinnedId
}: BlockProps & {
  modalActive: string
  setModalActive: React.Dispatch<React.SetStateAction<string>>
  lastPinnedId: number
}) {
  const intl = useIntl()
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

  const updateTaskData = (value: UserFormItem) => {
    if (!updateData) return

    if (value.pinned && value.pinnedId === -1)
      // eslint-disable-next-line no-param-reassign
      value.pinnedId = lastPinnedId ? 0 : 1 + 1
    // eslint-disable-next-line no-param-reassign
    else if (!value.pinned) delete value.pinnedId

    updateData({
      [value.keyType || blockTitle]: tasks.map((item) =>
        item.id === value.id ? value : item
      )
    })
  }

  const deleteTask = (taskId: number) => {
    if (!updateData) return

    updateData({
      [blockTitle]: tasks.filter((task) => task.id !== taskId)
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!updateData || !over) return

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((item) => item.id === active.id)
      const newIndex = tasks.findIndex((item) => item.id === over.id)

      const updatedTasks = [...tasks]

      // Update id or pinnedId based on blockTitle
      if (blockTitle !== "main") {
        const [movedTask] = updatedTasks.splice(oldIndex, 1)
        updatedTasks.splice(newIndex, 0, movedTask)

        // Update ids to reflect the new order
        updatedTasks.forEach((task, index) => {
          // eslint-disable-next-line no-param-reassign
          task.id = index
        })
      } else {
        const [movedTask] = updatedTasks.splice(oldIndex, 1)
        updatedTasks.splice(newIndex, 0, movedTask)

        // Update pinnedIds to reflect the new order
        updatedTasks.forEach((task, index) => {
          // eslint-disable-next-line no-param-reassign
          task.pinnedId = index
        })
      }

      // Sort tasks by id or pinnedId
      const sortedTasks = [...updatedTasks].sort((a, b) =>
        blockTitle !== "main"
          ? a.id - b.id
          : (a.pinnedId ?? 0) - (b.pinnedId ?? 0)
      )

      const task = tasks.find((item) => item.id === over.id)

      updateData({
        [task?.keyType || blockTitle]: sortedTasks
      })
    }
  }

  const http = "https://"
  const initialState =
    blockTitle === "links" ? http : blockTitle === "socials" ? http : ""
  const [input, setInput] = useState("")
  const [input1, setInput1] = useState(initialState)

  useEffect(() => {
    if (!modalActive) {
      if (input && input1 && updateData) {
        const newTask = {
          id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
          title: input,
          item: input1,
          pinned: false,
          pinnedId: -1,
          keyType: blockTitle
        }

        updateData({
          [blockTitle]: [...tasks, newTask]
        })

        setInput("")
        if (blockTitle === "phones") {
          setInput1(blockPrefix)
        } else {
          setInput1(initialState)
        }
      }
    }
  }, [modalActive])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target
    if (blockTitle === "telegrams") {
      value = value.replace(/[^a-zA-Z0-9_]/g, "")
      setInput1(value)
    } else if (blockTitle === "phones") {
      if (value.length <= 16) {
        value = value.replace(/[^0-9]/g, "")
        setInput1(`+${value}`)
      }
    } else {
      value = value.replace(/[^a-zA-Z0-9_!*.();:@&=+$,/?#[\]-]/g, "")
      setInput1(value)
    }
  }
  const [inputActive, setInputActive] = useState(false)

  const handleInputFocus = () => {
    setInputActive(true)
  }

  const handleInputBlur = () => {
    setInputActive(false)
  }

  const renderAddButton = () => {
    if ((tasks.length !== 5 || tasks.length < 5) && blockTitle !== "main") {
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
    if (!tasks.length) {
      return <div className="info_block">{renderAddButton()}</div>
    }

    const sortedTasks = [...tasks].sort((a, b) =>
      blockTitle !== "main"
        ? a.id - b.id
        : (a.pinnedId ?? 0) - (b.pinnedId ?? 0)
    )

    return (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="info_block">
          <SortableContext
            items={sortedTasks}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.map((item) => (
              <Task
                key={item.id}
                id={item.id}
                title={item.title}
                item={item.item}
                keyType={item.keyType}
                pinned={item.pinned}
                blockSubTitle={intl.formatMessage({
                  id: `sub_block_${blockTitle}`
                })}
                blockTitle={blockTitle}
                blockPrefix={blockPrefix}
                updateTaskData={updateTaskData}
                deleteTask={deleteTask}
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

  if (blockTitle === "main" && !tasks.length) return null

  return (
    <div className="info_block_container_edit" ref={blockRef}>
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
            setInput1(initialState)

            setModalActive("false")
          }}
        >
          <img src="/images/cross.svg" alt="Close" />
        </div>
        <div className="modal_input_container">
          <div className="input_title_2">
            <input
              type="text"
              placeholder="Title"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="fill_line_2" />
          <div className="input_title_2">
            {blockTitle === "telegrams" && <div>@</div>}
            <input
              type="text"
              placeholder={blockPrefix}
              value={input1}
              onChange={handleChange}
              className={inputActive ? "active" : ""}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={{ paddingLeft: "0" }}
            />
          </div>
        </div>
        <div className="modal_sub_text">
          {intl.formatMessage({ id: `sub_block_${blockTitle}` })}
        </div>
      </Modal>
    </div>
  )
}
