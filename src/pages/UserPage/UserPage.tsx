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
      <InfoBlock
        tasks={data.telegrams}
        blockTitle="telegrams"
        blockPrefix="@"
      />
      <InfoBlock tasks={data.socials} blockTitle="socials" blockPrefix="@" />
      <InfoBlock tasks={data.links} blockTitle="links" blockPrefix="" />
      <InfoBlock tasks={data.phones} blockTitle="phones" blockPrefix="+" />
      <InfoBlock tasks={data.mails} blockTitle="mails" blockPrefix="" />
      <InfoBlock tasks={data.wallets} blockTitle="wallets" blockPrefix="" />
    </div>
  )

  //       <PinnedBlock tasks={[]} blockTitle="main" blockPrefix="" />
}
