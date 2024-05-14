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
  setModalActive
}: BlockProps & {
  modalActive: string
  setModalActive: React.Dispatch<React.SetStateAction<string>>
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

    updateData({
      [blockTitle]: tasks.map((item) => (item.id === value.id ? value : item))
    })
  }

  const deleteTask = (taskId: number) => {
    if (!updateData) return

    updateData({
      [blockTitle]: tasks.filter((task) => task.id !== taskId)
    })
  }

  const handleDragEnd = ({ active, over }: any) => {
    if (!updateData) return

    if (active.id !== over.id) {
      updateData({
        [blockTitle]: arrayMove(
          tasks,
          tasks.findIndex((item) => item.id === active.id),
          tasks.findIndex((item) => item.id === over.id)
        )
      })
    }
  }

  const [input, setInput] = useState("")
  const [input1, setInput1] = useState("")

  useEffect(() => {
    if (!modalActive) {
      if (input && input1 && updateData) {
        const newTask = {
          id: tasks.length ? tasks[tasks.length - 1].id + 1 : 0,
          title: input,
          item: input1,
          pinned: false
        }
        updateData({
          [blockTitle]: [...tasks, newTask]
        })

        setInput("")
        if (
          blockTitle === "telegrams" ||
          blockTitle === "socials" ||
          blockTitle === "phones"
        ) {
          setInput1(blockPrefix)
        } else {
          setInput1("")
        }
      }
    }
  }, [modalActive])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target
    if (blockTitle === "telegrams" || blockTitle === "socials") {
      value = value.replace(/[^a-zA-Z0-9_]/g, "")
      setInput1("@" + value)
    } else if (blockTitle === "phones") {
      value = value.replace(/[^0-9]/g, "")
      if (value.length <= 16) {
        setInput1("+" + value)
      }
    } else {
      value = value.replace(/[^a-zA-Z0-9_!*.();:@&=+$,/?#[\]-]/g, "")
      setInput1(value)
    }
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

    return (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="info_block">
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((item) => (
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
