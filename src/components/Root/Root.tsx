import { DisplayGate, SDKProvider } from "@tma.js/sdk-react"
import { type FC } from "react"

import { App } from "~/components/App/App.tsx"

const Err: FC<{ error: unknown }> = ({ error }) => {
  return (
    <div>
      <p>An error occurred while initializing the SDK</p>
      <blockquote>
        <code>
          {error instanceof Error ? error.message : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  )
}

const Loading: FC = () => {
  return <div>Application is loading</div>
}

export const Root: FC = () => {
  return (
    <SDKProvider
      options={{
        acceptCustomStyles: true,
        cssVars: true,
        complete: true
      }}
    >
      <DisplayGate error={Err} loading={Loading} initial={Loading}>
        <App />
      </DisplayGate>
    </SDKProvider>
  )
}
