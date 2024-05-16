import { useInitData, useInitDataRaw, useMainButton } from "@tma.js/sdk-react"
import { useEffect, useState } from "react"
import { useIntl } from "react-intl"
// eslint-disable-next-line no-duplicate-imports
import type { FC } from "react"

import Notification from "~/components/InformationBlocks/Notification"
import { EditPage } from "~/pages/EditPage/EditPage.tsx"
import { UserPage } from "~/pages/UserPage/UserPage.tsx"
import { defaultUserFormData, type UserFormData } from "~/types/formData.ts"

import { StartPage } from "../StartPage/StartPage"

import "./IndexPage.css"

function addKeyTypeIfArray(obj: UserFormData) {
  Object.keys(obj).forEach((key) => {
    // @ts-ignore
    if (Array.isArray(obj[key])) {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      obj[key] = obj[key].map((element: any) => {
        if (typeof element === "object" && element !== null) {
          return { ...element, keyType: key }
        }
        return element
      })
    }
  })

  return obj
}

export const IndexPage: FC = () => {
  const intl = useIntl()

  const initData = useInitData()
  const rawData = useInitDataRaw()
  const mainButton = useMainButton()

  const [isEdit, setIsEdit] = useState(false)
  const [modalActive, setModalActive] = useState("")
  const [data, setData] = useState<UserFormData>({} as UserFormData)

  const saveDataToLocalStorage = (dataToSave: UserFormData) => {
    localStorage.setItem("user_data", JSON.stringify(dataToSave))
  }

  const updateData = (value: object) => {
    setData((prevData) => ({
      ...prevData,
      ...value
    }))
  }

  const saveData = async (dataToSave: UserFormData) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/saveData`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${rawData}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSave)
    })

    if (response.ok) saveDataToLocalStorage(dataToSave)
  }

  const getData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/getData?username=${data.username || initData?.startParam || ""}`,
        {
          headers: {
            Authorization: `Bearer ${rawData}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (response.ok) {
        const responseData = await response.json()

        setData(addKeyTypeIfArray(responseData))
      } else setData(addKeyTypeIfArray(defaultUserFormData))
    } catch (error) {
      setData(addKeyTypeIfArray(defaultUserFormData))

      console.error(error)
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  useEffect(() => {
    const disableButton = () => {
      mainButton.disable()
      mainButton.setBackgroundColor("#808080")
    }

    const enableButton = () => {
      mainButton.enable()
      mainButton.setBackgroundColor("#5288c1")
    }

    const use = () => {
      if (modalActive) setModalActive("")
      else if (data.username) {
        void saveData(data)
      } else setIsEdit(true)
    }

    const existsCondition = data.username && data.name && data.image
    if (modalActive) {
      enableButton()

      mainButton.setText(intl.formatMessage({ id: "save" }))
    } else if (isEdit) {
      mainButton.show()

      if (!existsCondition) disableButton()
      else enableButton()

      mainButton.setText(intl.formatMessage({ id: "save" }))
    } else if (!existsCondition) {
      mainButton.show()

      mainButton.enable()
      mainButton.setText(intl.formatMessage({ id: "create" }))
    } else mainButton.hide()

    mainButton.on("click", use)
    return () => mainButton.off("click", use)
  }, [modalActive, isEdit, data])

  const [isNotificationActive, setIsNotificationActive] =
    useState<boolean>(false)

  const [textNotification, setTextNotification] = useState("")

  const showNotification = (url: string) => {
    setIsNotificationActive(true)
    setTextNotification(url)
    setTimeout(() => {
      setIsNotificationActive(false)
    }, 1000)
  }

  return (
    <div className="index_page_container">
      {isEdit ? (
        <EditPage
          data={data}
          updateData={updateData}
          modalActive={modalActive}
          setModalActive={setModalActive}
        />
      ) : data.username ? (
        <UserPage
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          data={data}
          isOwner={data.userId === initData?.user?.id}
          showNotification={showNotification}
        />
      ) : (
        <StartPage />
      )}
      <Notification isActive={isNotificationActive} text={textNotification} />
    </div>
  )
}
