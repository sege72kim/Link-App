import React, { useState, useRef, ChangeEvent } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./EditPage.css"
import { EditBlock } from "~/components/InformationBlocks/EditBlock"
import { PinnedBlock } from "~/components/InformationBlocks/PinnedBlock"
import { FormattedMessage, useIntl } from "react-intl"
interface Item {
  id: number
  title: string
  url: string
}
export const EditPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [pinArray, setPinArray] = useState<Item[]>([])

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

  const handlePinClick = (
    id: number,
    title: string,
    url: string,
    updatedPins: { id: number; title: string; url: string }[]
  ) => {
    console.log("Выбранный title:", title)
    console.log("Выбранный url:", url)
    setPinArray(updatedPins)
  }

  const array = [
    {
      id: 1,
      title: "MainChannel",
      url: "notmeme.org"
    },
    {
      id: 2,
      title: "MainChannel2",
      url: "notmeme.org"
    },
    {
      id: 3,
      title: "MainChannel3",
      url: "notmeme.org"
    },
    {
      id: 4,
      title: "MainChannel4",
      url: "notmeme.org"
    }
  ]
  const shedevr = () => {
    console.log(pinArray)
  }
  const intl = useIntl()
  return (
    <Page title="Edit Page">
      <div className="edit_page">
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
            <FormattedMessage id="set_new_photo" />
          </div>
        </div>

        <div className="info_container">
          <div className="input_wrapper">
            <input
              className="input_bar"
              type="text"
              placeholder={intl.formatMessage({ id: "input_1" })}
            />
          </div>
        </div>
        <div className="info_container">
          <div className="info_title"></div>
          <div className="input_wrapper">
            <input
              className="input_bar"
              type="text"
              placeholder={Placeholder2}
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
              value={text}
              onChange={handleChange}
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
        <PinnedBlock
          tasks={array}
          blocktitle={intl.formatMessage({ id: "title1" })}
          blocksub={intl.formatMessage({ id: "sub_2" })}
          handlePinClick={handlePinClick}
          pinArray={pinArray}
          prefixprop=""
        />
        <EditBlock
          tasks={array}
          blocktitle={intl.formatMessage({ id: "title2" })}
          blocksub={intl.formatMessage({ id: "sub_3" })}
          handlePinClick={handlePinClick}
          pinArray={pinArray}
          prefixprop="t.me/"
        />
        <EditBlock
          tasks={array}
          blocktitle={intl.formatMessage({ id: "title3" })}
          blocksub={intl.formatMessage({ id: "sub_4" })}
          handlePinClick={handlePinClick}
          pinArray={pinArray}
          prefixprop=""
        />
        <EditBlock
          tasks={array}
          blocktitle={intl.formatMessage({ id: "title4" })}
          blocksub={intl.formatMessage({ id: "sub_5" })}
          handlePinClick={handlePinClick}
          pinArray={pinArray}
          prefixprop=""
        />
        <EditBlock
          tasks={array}
          blocktitle={intl.formatMessage({ id: "title5" })}
          blocksub={intl.formatMessage({ id: "sub_6" })}
          handlePinClick={handlePinClick}
          pinArray={pinArray}
          prefixprop="+"
        />
        <EditBlock
          tasks={array}
          blocktitle={intl.formatMessage({ id: "title6" })}
          blocksub={intl.formatMessage({ id: "sub_7" })}
          handlePinClick={handlePinClick}
          pinArray={pinArray}
          prefixprop=""
        />
        <EditBlock
          tasks={array}
          blocktitle={intl.formatMessage({ id: "title7" })}
          blocksub={intl.formatMessage({ id: "sub_8" })}
          handlePinClick={handlePinClick}
          pinArray={pinArray}
          prefixprop=""
        />
        <button onClick={shedevr}>322</button>
      </div>
    </Page>
  )
}
