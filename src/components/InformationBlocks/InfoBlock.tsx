import "./styles.css"

interface Item {
  id: number
  title: string
  url: string
}

interface Props {
  tasks: Item[]
  blocktitle: string
}
export const InfoBlock: React.FC<Props> = ({ tasks, blocktitle }) => {
  if (!tasks || tasks.length === 0) {
    return <></>
  } else {
    return (
      <div className="info_block_container">
        <div className="block_title">{blocktitle}</div>
        <div className="info_block">
          {tasks.map((item) => (
            <div key={item.id} className="item_container">
              <div className="item_title">{item.title}</div>
              <div className="item_url">@{item.url}</div>
              <div className="fill_line" />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
