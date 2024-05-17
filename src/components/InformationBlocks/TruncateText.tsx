import React from "react"

interface Props {
  text: string
  maxLength: number
}

const TruncateText: React.FC<Props> = ({
                                         text,
                                         maxLength
                                       }) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const truncate = (str: string, maxLength: number): string => {
    if (str.length <= maxLength) {
      return str
    }
    const start = str.substring(0, maxLength / 2)
    const end = str.substring(str.length - maxLength / 2)
    return `${start}...${end}`
  }
  const truncatedText = truncate(text, maxLength)

  return (
    <div title={text} className="connect__textp">
      {truncatedText}
    </div>
  )
}

export default TruncateText
