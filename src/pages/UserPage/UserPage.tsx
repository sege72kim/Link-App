import { FormattedMessage } from "react-intl"

import { InfoBlock } from "~/components/InformationBlocks/InfoBlock"
import type { UserFormData } from "~/types/formData.ts"

import "./UserPage.css"

interface Props {
  data: UserFormData
  setIsEdit: (value: boolean) => void
  isEdit: boolean
  isOwner: boolean
}

export function UserPage({ isEdit, setIsEdit, data, isOwner }: Props) {
  const checkFunc = () => {
    console.log(pinnedItems)
  }
  const pinnedItems = Object.values(data).reduce(
    (accumulator, currentValue) => {
      if (Array.isArray(currentValue)) {
        const pinnedItems = currentValue.filter((item) => item.pinned)
        accumulator.push(...pinnedItems)
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
        <div className="user_names_block">
          <div className="nickname">{data.name}</div>
          <div className="user_name">{data.username}</div>
        </div>
      </div>
      {isOwner && (
        <div className="edit_button" onClick={() => setIsEdit(!isEdit)}>
          <FormattedMessage id="edit" />
        </div>
      )}
      <InfoBlock tasks={pinnedItems} blockTitle="Main" />
      <InfoBlock tasks={data.about} blockTitle="About" />
      <InfoBlock tasks={data.telegrams} blockTitle="Telegrams" />
      <InfoBlock tasks={data.socials} blockTitle="Socials" />
      <InfoBlock tasks={data.links} blockTitle="Links" />
      <InfoBlock tasks={data.phones} blockTitle="Phones" />
      <InfoBlock tasks={data.mails} blockTitle="Mails" />
      <InfoBlock tasks={data.wallets} blockTitle="Wallets" />
      <button onClick={checkFunc}>222</button>
    </div>
  )

  //       <PinnedBlock tasks={[]} blockTitle="main" blockPrefix="" />
}
