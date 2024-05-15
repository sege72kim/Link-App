import { useInitData, useInitDataRaw, useMainButton } from "@tma.js/sdk-react"
import { useEffect, useState } from "react"
import { useIntl } from "react-intl"
// eslint-disable-next-line no-duplicate-imports
import type { FC } from "react"

import { EditPage } from "~/pages/EditPage/EditPage.tsx"
import { UserPage } from "~/pages/UserPage/UserPage.tsx"
import { defaultUserFormData, type UserFormData } from "~/types/formData.ts"

import { StartPage } from "../StartPage/StartPage"

import "./IndexPage.css"
import Notification from "~/components/InformationBlocks/Notification"

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

        setData(responseData)
      } else setData(defaultUserFormData)
    } catch (error) {
      setData({
        userId: 957008377,
        image:
          "https://img.freepik.com/free-photo/the-adorable-illustration-of-kittens-playing-in-the-forest-generative-ai_260559-483.jpg?size=338&ext=jpg&ga=GA1.1.44546679.1715644800&semt=ais_user",
        name: "Sergye",
        username: "sergey728",
        about: {
          text: "About bruh",
          pinned: false
        },
        telegrams: [
          {
            id: 1,
            title: "Main",
            item: "segega_k",
            pinned: true,
            keyType: "telegrams"
          },
          {
            id: 2,
            title: "Study Account",
            item: "@Segega2",
            pinned: true
          }
        ],
        socials: [
          {
            id: 1,
            title: "Inst",
            item: "@segega.k",
            pinned: true
          },
          {
            id: 2,
            title: "Steam",
            item: "segega.k",
            pinned: true,
            keyType: "socials"
          }
        ],
        links: [
          {
            id: 1,
            title: "Github",
            item: "https://github.com",
            pinned: true
          },
          {
            id: 2,
            title: "CodeSandbox",
            item: "https://chatgpt.com",
            pinned: true
          }
        ],
        phones: [
          {
            id: 1,
            title: "Github",
            item: "+9932013",
            pinned: true,
            keyType: "phones"
          },
          {
            id: 2,
            title: "MamaEbal",
            item: "+34664231",
            pinned: true,
            keyType: "phones"
          }
        ],
        mails: [],
        wallets: []
      })
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
