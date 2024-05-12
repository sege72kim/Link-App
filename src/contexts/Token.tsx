// eslint-disable-next-line no-duplicate-imports
import React, { createContext, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"

interface TokenContextType {
  token: string | null
  setToken: (newToken: TokenContextType["token"]) => void
}

const TokenContext = createContext<TokenContextType | undefined>(undefined)

interface TokenProviderProps {
  children: ReactNode
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, set] = useState<TokenContextType["token"]>("")

  const setToken = (newToken: TokenContextType["token"]) => {
    set(newToken)
  }

  const value = useMemo(
    () => ({
      token,
      setToken
    }),
    [token]
  )

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}

export const useToken = () => {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider")
  }

  return context
}
