import { useInitDataRaw } from "@tma.js/sdk-react"
import React, {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
  useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { EditBlock } from "~/components/InformationBlocks/EditBlock"
import type { UserFormData } from "~/types/formData.ts"

import "./EditPage.css"

interface Props {
  data: UserFormData
  updateData: (value: object) => void
  modalActive: string
  setModalActive: Dispatch<SetStateAction<string>>
}

export function EditPage({
  data,
  updateData,
  modalActive,
  setModalActive
}: Props) {
  const intl = useIntl()
  const rawData = useInitDataRaw()

  const [selectedImage, setSelectedImage] = useState<string | null>(
    data.image || null
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append("image", file)

      fetch(`${import.meta.env.VITE_API_URL}/uploadImage`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${rawData}`
        }
      })
        .then((response) => response.json())
        .then((responseData) => {
          setSelectedImage(responseData.url)
          updateData({ image: responseData.url })
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  }

  const handleButtonClick = () => {
    if (inputRef.current) inputRef.current.click()
  }

  const handleChange = (
    type: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      type === "about"
        ? { text: event.target.value, pinned: data.about?.pinned }
        : event.target.value
    updateData({ [type]: value })
  }
  const [username_input, setUserName] = useState("@username")
  return (
    <div className="edit_page">
      <div className="avatar_picking" onClick={handleButtonClick}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <div className="avatar_edit">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <img
              src="/images/camera.svg"
              alt="Placeholder"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          )}
        </div>
        <div className="new_avatar_button">
          <FormattedMessage id="set_new_photo" />
        </div>
      </div>
      <div className="info_container">
        <div className="input_wrapper">
          <input
            className="input_bar"
            type="text"
            placeholder={intl.formatMessage({ id: "input_1" })}
            onChange={(event) => handleChange("name", event)}
          />
        </div>
      </div>
      <div className="info_container">
        <div className="info_title" />
        <div className="input_wrapper">
          <input
            className="input_bar"
            type="text"
            placeholder="@username"
            value={username_input}
            onChange={(event) => handleChange("username", event)}
          />
        </div>
        <div className="info_subscription">
          <div>
            <FormattedMessage id="info_sub_1" />
          </div>
          <div>
            <FormattedMessage id="info_sub_2" />
          </div>
          <div style={{ color: "var(--link-text-color)" }}>
            t.me/linksapp_bot/app?startApp=username
          </div>
        </div>
      </div>
      <div className="info_container">
        <div className="input_wrapper">
          <textarea
            className="input_bar"
            value={data.about?.text || ""}
            onChange={(event) => handleChange("about", event)}
            maxLength={100}
            rows={4}
            style={{
              resize: "none",
              fontSize: "17px",
              fontWeight: "400",
              color: "var(--color)"
            }}
            placeholder={intl.formatMessage({ id: "input_2" })}
          />
        </div>
        <div className="info_subscription">
          <div>
            <FormattedMessage id="sub_1" />
          </div>
        </div>
      </div>
      <EditBlock
        tasks={data.telegrams}
        blockTitle="Telegrams"
        blockPrefix="@"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
      />
      <EditBlock
        tasks={data.socials}
        blockTitle="Socials"
        blockPrefix="@"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
      />
      <EditBlock
        tasks={data.links}
        blockTitle="Links"
        blockPrefix="Link"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
      />
      <EditBlock
        tasks={data.phones}
        blockTitle="Phones"
        blockPrefix="+"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
      />
      <EditBlock
        tasks={data.mails}
        blockTitle="Mails"
        blockPrefix="Mail"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
      />
      <EditBlock
        tasks={data.wallets}
        blockTitle="Wallets"
        blockPrefix="Wallet"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
      />
    </div>
  )

  // <PinnedBlock tasks={[]} blockTitle="main" blockPrefix="" />
}
