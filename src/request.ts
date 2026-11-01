import type { RequestOptions } from '../types/types.js'

export const endpoint =
  'https://www.vinbudin.is/addons/origo/module/ajaxwebservices/search.asmx/'

/** All callers fail closed: a failed/malformed response is never an empty result. */
export async function request(
  url: string,
  options: RequestOptions = {},
): Promise<unknown> {
  const signal = options.signal
  const timeoutMs = options.timeoutMs ?? 30_000
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new Error('timeoutMs must be positive')
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) controller.abort()
  const timer = setTimeout(abort, timeoutMs)
  try {
    if (controller.signal.aborted) throw new Error('Vínbúðin request aborted')
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json; charset=utf-8',
      },
    })
    if (!response.ok) throw new Error(`Vínbúðin HTTP ${response.status}`)
    const envelope: unknown = await response.json()
    if (
      !envelope ||
      typeof envelope !== 'object' ||
      !('d' in envelope) ||
      typeof envelope.d !== 'string'
    ) {
      throw new Error('Invalid Vínbúðin response envelope')
    }
    return JSON.parse(envelope.d)
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}
