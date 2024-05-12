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
import { useEffect, useRef, useState } from "react"

import type { BlockProps } from "~/types/block.ts"
import type { UserFormItem } from "~/types/formData.ts"

import "./styles.css"

import Task from "./Task"

export function PinnedBlock({ tasks, blockTitle, blockPrefix }: BlockProps) {
  const [tasks1, setTasks] = useState<UserFormItem[]>(tasks)
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

    setTasks((prevState) => {
      const originalPos = getTaskPos(active.id)
      const newPos = getTaskPos(over.id)

      return arrayMove(prevState, originalPos, newPos)
    })
  }

  const blockRef = useRef<HTMLDivElement>(null)

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

  if (!pinArray || !pinArray.length) return null

  return (
    <div className="info_block_container_edit">
      <div className="block_title">{blockTitle}</div>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="info_block">
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {pinArray.map((item) => (
              <Task
                id={item.id}
                title={item.title}
                url={item.url}
                key={item.id}
                onPinClick={handlePinClick}
                pinArray={pinArray}
                blockSubTitle={blockSubTitle}
                tasks={tasks1}
                setTasks={setTasks}
                type={blockTitle}
                prefix={prefix}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <div className="info_subscription_2">
        <div>{blockSubTitle}</div>
      </div>
    </div>
  )
}
