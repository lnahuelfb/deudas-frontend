import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "../queryClient"
import { usePWADebug } from "@/hooks/usePWADebug"

type Props = {
  children: React.ReactNode
}

function DebugWrapper({ children }: Props) {
  usePWADebug()
  return <>{children}</>
}

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <DebugWrapper>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </DebugWrapper>
    </QueryClientProvider>
  )
}