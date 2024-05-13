import { useInitData, useInitDataRaw, useMainButton } from "@tma.js/sdk-react"
import { useEffect, useState } from "react"
import { useIntl } from "react-intl"
// eslint-disable-next-line no-duplicate-imports
import type { FC } from "react"

import { EditPage } from "~/pages/EditPage/EditPage.tsx"
import { UserPage } from "~/pages/UserPage/UserPage.tsx"
import { defaultUserFormData } from "~/types/formData.ts"
import type { UserFormData } from "~/types/formData.ts"

import { StartPage } from "../StartPage/StartPage"

import "./IndexPage.css"

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
        `${import.meta.env.VITE_API_URL}/getData?username=${initData?.startParam}`,
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
      setData(defaultUserFormData)
      // setData({
      //   userId: 23,
      //   image: "./images/camera.svg",
      //   name: "string",
      //   username: "string",
      //   about: {
      //     text: "string3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
      //     pinned: true
      //   },
      //   telegrams: [
      //     {
      //       id: 1,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     },
      //     {
      //       id: 2,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     },
      //     {
      //       id: 3,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     }
      //   ],
      //   socials: [
      //     {
      //       id: 1,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     },
      //     {
      //       id: 2,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     },
      //     {
      //       id: 3,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     }
      //   ],
      //   links: [
      //     {
      //       id: 1,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     },
      //     {
      //       id: 2,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     },
      //     {
      //       id: 3,
      //       title: "tring",
      //       item: "string",
      //       pinned: true
      //     }
      //   ],
      //   phones: [],
      //   mails: [],
      //   wallets: []
      // })
    }
  }

  useEffect(() => {
    void getData()
  }, [])

  useEffect(() => {
    const use = () => {
      if (modalActive) setModalActive("")
      else if (data.username) {
        void saveData(data)
      } else setIsEdit(true)
    }

    if (data.username || isEdit) {
      mainButton.setText(intl.formatMessage({ id: "save" }))
    } else mainButton.setText(intl.formatMessage({ id: "create" }))

    mainButton.enable()
    mainButton.show()

    mainButton.on("click", use)
    return () => mainButton.off("click", use)
  }, [modalActive, isEdit, data])

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
          isOwner={initData?.startParam === data.username}
        />
      ) : (
        <StartPage />
      )}
    </div>
  )
}
