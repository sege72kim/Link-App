import { postEvent, Utils } from "@tma.js/sdk"
import { FormattedMessage } from "react-intl"

import { AboutBlock } from "~/components/InformationBlocks/AboutBlock"
import { InfoBlock } from "~/components/InformationBlocks/InfoBlock"
import type { UserFormData } from "~/types/formData.ts"

import "./UserPage.css"

interface Props {
  data: UserFormData
  setIsEdit: (value: boolean) => void
  isEdit: boolean
  isOwner: boolean
  showNotification: (value: string) => void
}

const utils = new Utils("7.0", () => Math.random().toString(), postEvent)

export function UserPage({
  isEdit,
  setIsEdit,
  data,
  isOwner,
  showNotification
}: Props) {
  const pinnedItems = Object.values(data).reduce(
    (accumulator, currentValue) => {
      if (Array.isArray(currentValue)) {
        const pinnedItemsInner = currentValue.filter((item) => item.pinned)
        accumulator.push(...pinnedItemsInner)
      } else if (
        typeof currentValue === "object" &&
        currentValue.pinned === true
      ) {
        accumulator.push(currentValue)
      }

      return accumulator
    },
    []
  )

  return (
    <div className="user_page">
      <div
        className="user_page_img"
        style={{
          backgroundImage: `url(${data.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%"
        }}
      >
        <div
          className="share"
          onClick={() =>
            utils.openTelegramLink(
              `https://t.me/share/url?url=t.me/linksappbot/app?startapp=${data.username}`
            )
          }
        >
          <div className="share_button">
            <FormattedMessage id="share" />
          </div>
        </div>
        <div className="user_names_block">
          <div className="nickname">{data.name}</div>
          <div className="user_name">@{data.username}</div>
        </div>
      </div>
      {isOwner && (
        <div className="edit_button" onClick={() => setIsEdit(!isEdit)}>
          <FormattedMessage id="edit" />
        </div>
      )}
      <AboutBlock text={data.about.text} />
      <InfoBlock
        tasks={pinnedItems}
        blockTitle="main"
        blockPrefix=""
        showNotification={showNotification}
      />

      <InfoBlock
        tasks={data.telegrams}
        blockTitle="telegrams"
        blockPrefix="@"
        showNotification={showNotification}
      />
      <InfoBlock
        tasks={data.socials}
        blockTitle="socials"
        blockPrefix="@"
        showNotification={showNotification}
      />
      <InfoBlock
        tasks={data.links}
        blockTitle="links"
        blockPrefix=""
        showNotification={showNotification}
      />
      <InfoBlock
        tasks={data.phones}
        blockTitle="phones"
        blockPrefix="+"
        showNotification={showNotification}
      />
      <InfoBlock
        tasks={data.mails}
        blockTitle="mails"
        blockPrefix=""
        showNotification={showNotification}
      />
      <InfoBlock
        tasks={data.wallets}
        blockTitle="wallets"
        blockPrefix=""
        showNotification={showNotification}
      />
    </div>
  )
}
