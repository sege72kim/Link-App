import React, { useState, useRef, ChangeEvent } from "react"
import { Page } from "~/components/Page/Page.tsx"
import "./EditPage.css"

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
        <div className="new_avatar_button">Set New Photo</div>
      </div>
    </Page>
  )
}
