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
    id: number,
    title: string,
    url: string,
    pinArray: { id: number; title: string; url: string }[]
  ) => void
  pinArray: { id: number; title: string; url: string }[]
  prefixprop: string
}

export const PinnedBlock: React.FC<Props> = ({
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
  if (!pinArray || pinArray.length === 0) {
    return <></>
  } else
    return (
      <div className="info_block_container_edit">
        <div className="block_title">{blocktitle}</div>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="info_block">
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              {pinArray.map((item) => (
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
