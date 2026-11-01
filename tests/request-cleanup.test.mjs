import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getEventListeners } from 'node:events'
import { getStores } from '../dist/index.js'

function observeCleanup(t, signal) {
  const scheduled = t.mock.method(globalThis, 'setTimeout')
  const cleared = t.mock.method(globalThis, 'clearTimeout')
  return () => {
    assert.equal(getEventListeners(signal, 'abort').length, 0)
    assert.equal(scheduled.mock.callCount(), 1)
    assert.equal(cleared.mock.callCount(), 1)
    assert.equal(
      cleared.mock.calls[0].arguments[0],
      scheduled.mock.calls[0].result,
    )
  }
}

for (const outcome of ['success', 'HTTP error']) {
  for (const mutation of ['replaced', 'deleted']) {
    test(`${outcome} cleans up the original signal after options.signal is ${mutation} during fetch`, async (t) => {
      const original = new AbortController()
      const replacement = new AbortController()
      const options = { signal: original.signal }
      const assertCleanup = observeCleanup(t, original.signal)
      let complete
      t.mock.method(
        globalThis,
        'fetch',
        () =>
          new Promise((resolve) => {
            complete = resolve
          }),
      )

      const pending = getStores(options)
      assert.equal(getEventListeners(original.signal, 'abort').length, 1)
      if (mutation === 'replaced') options.signal = replacement.signal
      else delete options.signal

      complete(
        new Response(JSON.stringify({ d: '[]' }), {
          status: outcome === 'success' ? 200 : 503,
        }),
      )
      if (outcome === 'success') assert.deepEqual(await pending, [])
      else await assert.rejects(pending, /503/)

      assertCleanup()
      assert.equal(getEventListeners(replacement.signal, 'abort').length, 0)
    })
  }
}

test('caller abort cancels a pending fetch and cleans up its listener and timeout', async (t) => {
  const controller = new AbortController()
  const assertCleanup = observeCleanup(t, controller.signal)
  let fetchSignal
  t.mock.method(globalThis, 'fetch', (_url, { signal }) => {
    fetchSignal = signal
    return new Promise((_resolve, reject) => {
      signal.addEventListener(
        'abort',
        () => reject(new Error('Caller aborted')),
        { once: true },
      )
    })
  })

  const pending = getStores({ signal: controller.signal })
  assert.equal(getEventListeners(controller.signal, 'abort').length, 1)
  const rejected = assert.rejects(pending, /Caller aborted/)
  controller.abort()
  await rejected

  assert.equal(fetchSignal.aborted, true)
  assertCleanup()
})

test('timeout still cancels a stalled response body and cleans up its listener and timer', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  const assertCleanup = observeCleanup(t, controller.signal)
  const bodyStarted = Promise.withResolvers()
  let fetchSignal
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => {
    fetchSignal = signal
    return {
      ok: true,
      json: () =>
        new Promise((_resolve, reject) => {
          signal.addEventListener(
            'abort',
            () => reject(new Error('Body timed out')),
            { once: true },
          )
          bodyStarted.resolve()
        }),
    }
  })

  const pending = getStores({ signal: controller.signal, timeoutMs: 25 })
  const rejected = assert.rejects(pending, /Body timed out/)
  await bodyStarted.promise
  assert.equal(fetchSignal.aborted, false)
  assert.equal(getEventListeners(controller.signal, 'abort').length, 1)
  t.mock.timers.tick(25)
  await rejected

  assert.equal(fetchSignal.aborted, true)
  assert.equal(controller.signal.aborted, false)
  assertCleanup()
})
