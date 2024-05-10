import "./InfoBlock.css"

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
  //   const [tasks, setTasks] = useState([
  //     {
  //       id: 1,
  //       title: "MainChannel",
  //       url: "notmeme.org"
  //     },
  //     {
  //       id: 2,
  //       title: "MainChannel2",
  //       url: "notmeme.org"
  //     },
  //     {
  //       id: 3,
  //       title: "MainChannel3",
  //       url: "notmeme.org"
  //     },
  //     {
  //       id: 4,
  //       title: "MainChannel4",
  //       url: "notmeme.org"
  //     },
  //     {
  //       id: 5,
  //       title: "MainChannel5",
  //       url: "notmeme.org"
  //     }
  //   ])
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
