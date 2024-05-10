import "./styles.css"

interface Item {
  id: number
  title: string
  url: string
}

interface Props {
  tasks: Item[]
  blocktitle: string
  blocksub: string
}
export const EditBlock: React.FC<Props> = ({ tasks, blocktitle, blocksub }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="info_block_container_edit">
        <div className="block_title">{blocktitle}</div>
        <div className="info_block">
          <div className="item_container">
            <div className="add_button">
              <div className="plus">+</div>
              <div className="add">add</div>
            </div>
          </div>
        </div>
        <div className="info_subscription_2">
          <div>{blocksub}</div>
        </div>
      </div>
    )
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
