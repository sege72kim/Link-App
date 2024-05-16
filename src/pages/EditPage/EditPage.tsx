import { useInitDataRaw } from "@tma.js/sdk-react"
import React, {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { EditBlock } from "~/components/InformationBlocks/EditBlock"
import type { UserFormData, UserFormItem } from "~/types/formData.ts"

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

  const pinnedItems: UserFormItem[] = useMemo(
    () =>
      Object.entries(data).reduce<UserFormItem[]>(
        (accumulator, [_, currentValue]) => {
          if (Array.isArray(currentValue)) {
            const pinnedArrayItems = currentValue
              .filter((item) => item.pinned)
              .map((item) => ({ ...item }))

            accumulator.push(...pinnedArrayItems)
          }

          return accumulator
        },
        []
      ),
    [data]
  )

  const handleButtonClick = () => {
    if (inputRef.current) inputRef.current.click()
  }

  const [input1, setInput1] = useState("")
  const [apiUsername, setApiUsername] = useState<undefined | number>(undefined)

  const handleChange = (
    type: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (type === "about") {
      const value = { text: event.target.value, pinned: data.about?.pinned }
      updateData({ [type]: value })
    } else if (type === "name") {
      updateData({ [type]: event.target.value })
    } else {
      let { value } = event.target

      value = value.replace(/[^a-zA-Z0-9_]/g, "")
      setInput1(`${value}`)
      updateData({ [type]: value })

      fetch(
        `${import.meta.env.VITE_API_URL}/isUsernameAvailable?username=${data.username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${rawData}`
          }
        }
      )
        .then(() => setApiUsername(1))
        .catch(() => setApiUsername(2))
    }
  }

  const [aboutText, setAboutText] = useState(data.about?.text || "")
  const [userText, setUserText] = useState("")
  const [inputActive, setInputActive] = useState(false)

  const handleInputFocus = () => {
    setInputActive(true)
  }

  const handleInputBlur = () => {
    setInputActive(false)
  }
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
            onChange={(event) => {
              handleChange("name", event)
            }}
          />
        </div>
      </div>
      <div className="info_container">
        <div className="info_title" />
        <div className="input_wrapper">
          <div>@</div>
          <input
            type="text"
            placeholder="username"
            value={input1}
            className={inputActive ? "input_bar active" : "input_bar"}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(event) => {
              const newUsername = event.target.value
              setUserText(newUsername)

              handleChange("username", event)
            }}
          />
        </div>
        <div className="info_subscription">
          {/* До ввода */}
          <div>
            <FormattedMessage id="info_sub_1" />
          </div>
          <div>
            <FormattedMessage id="info_sub_2" />
          </div>
          <div style={{ color: "var(--link-text-color)" }}>
            t.me/linksapp_bot/app?startApp={data.username}
          </div>
          {!apiUsername ? (
            <div style={{ color: "var(--link-text-color)" }} />
          ) : apiUsername === 2 ? (
            <div style={{ color: "red" }}>
              <FormattedMessage id="info_sub_6" />
            </div>
          ) : (
            <div style={{ color: "#31D158" }}>
              @{userText}
              <FormattedMessage id="info_sub_4" />
            </div>
          )}
        </div>
      </div>

      <div className="info_container">
        <div className="input_wrapper">
          <textarea
            className="input_bar"
            value={aboutText}
            onChange={(event) => {
              const newText = event.target.value
              setAboutText(newText)
              handleChange("about", event)
            }}
            rows={4}
            style={{
              resize: "none",
              fontSize: "17px",
              fontWeight: "400",
              color: "var(--color)"
            }}
            placeholder={intl.formatMessage({ id: "input_2" })}
          />
          <div className="right_about_container">
            <div className="over_text">
              {aboutText.length > 140 && (
                <div style={{ color: "red" }}>-{aboutText.length - 140}</div>
              )}
            </div>
          </div>
        </div>
        <div className="info_subscription">
          <div>
            <FormattedMessage id="sub_1" />
          </div>
        </div>
      </div>
      <EditBlock
        tasks={pinnedItems}
        blockTitle="main"
        blockPrefix="Main"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
        lastPinnedId={pinnedItems[pinnedItems.length - 1]?.id}
      />
      <EditBlock
        tasks={data.telegrams}
        blockTitle="telegrams"
        blockPrefix="Username"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
        lastPinnedId={pinnedItems[pinnedItems.length - 1]?.id}
      />
      <EditBlock
        tasks={data.socials}
        blockTitle="socials"
        blockPrefix="Link"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
        lastPinnedId={pinnedItems[pinnedItems.length - 1]?.id}
      />
      <EditBlock
        tasks={data.links}
        blockTitle="links"
        blockPrefix="Link"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
        lastPinnedId={pinnedItems[pinnedItems.length - 1]?.id}
      />
      <EditBlock
        tasks={data.phones}
        blockTitle="phones"
        blockPrefix="+"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
        lastPinnedId={pinnedItems[pinnedItems.length - 1]?.id}
      />
      <EditBlock
        tasks={data.mails}
        blockTitle="mails"
        blockPrefix="Mail"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
        lastPinnedId={pinnedItems[pinnedItems.length - 1]?.id}
      />
      <EditBlock
        tasks={data.wallets}
        blockTitle="wallets"
        blockPrefix="Wallet"
        modalActive={modalActive}
        setModalActive={setModalActive}
        updateData={updateData}
        lastPinnedId={pinnedItems[pinnedItems.length - 1]?.id}
      />
    </div>
  )
}
