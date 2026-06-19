const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])
const env = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>
}).env ?? {}

const browserHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
export const isLocalAgentRuntime = LOCAL_HOSTS.has(browserHost)

export const agentHttpBase =
  env.VITE_AGENT_API_BASE ?? (isLocalAgentRuntime ? 'http://127.0.0.1:3334' : '')

export const agentWsUrl =
  isLocalAgentRuntime
    ? (env.VITE_AGENT_WS_URL ?? 'ws://localhost:3334/ws')
    : undefined

export function apiUrl(path: string): string {
  return `${agentHttpBase}${path}`
}
