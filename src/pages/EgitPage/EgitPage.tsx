import React, { useState, useRef, ChangeEvent } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./EditPage.css"
import { EditBlock } from "~/components/InformationBlocks/EditBlock"

export const EditPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
    }
  }

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }
  const [text, setText] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  const Placeholder = "Name"
  const Placeholder2 = "@username"
  const Placeholder3 = "About"
  const array = []
  return (
    <Page title="Edit Page">
      <div className="avatar_picking">
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
              src={typeof selectedImage === "string" ? selectedImage : ""}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <img
              src="./images/camera.svg"
              alt="Placeholder"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          )}
        </div>
        <div className="new_avatar_button" onClick={handleButtonClick}>
          Set New Photo
        </div>
      </div>

      <div className="info_container">
        <div className="input_wrapper">
          <input className="input_bar" type="text" placeholder={Placeholder} />
        </div>
      </div>
      <div className="info_container">
        <div className="info_title">USERNAME</div>
        <div className="input_wrapper">
          <input className="input_bar" type="text" placeholder={Placeholder2} />
        </div>
        <div className="info_subscription">
          <div>You can choose a username on Links App.</div>
          <div>
            You can use a-z, 0-9 and underscores. Minimum length is 5
            characters.
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
            value={text}
            onChange={handleChange}
            maxLength={100}
            rows={4}
            style={{
              resize: "none",
              fontSize: "16px",
              fontWeight: "400"
            }}
            placeholder={Placeholder3}
          />
        </div>
        <div className="info_subscription">
          <div>
            You can add a few lines of description. Maximum 140 symbols.
          </div>
        </div>
      </div>
      <EditBlock
        tasks={array}
        blocktitle="telegram"
        blocksub="You can add up to 5 Telegram accounts, groups or channels usernames."
      />
      <EditBlock
        tasks={array}
        blocktitle="Social networks"
        blocksub="You can add up to 10 social network links."
      />
      <EditBlock
        tasks={array}
        blocktitle="links"
        blocksub="You can add up to 5 links."
      />
      <EditBlock
        tasks={array}
        blocktitle="phone"
        blocksub="You can add up to 5 phone numbers."
      />
      <EditBlock
        tasks={array}
        blocktitle="mail"
        blocksub="You can add up to 5 Emails."
      />
      <EditBlock
        tasks={array}
        blocktitle="wallet"
        blocksub="You can add up to 5 Crypto Wallets."
      />
    </Page>
  )
}
