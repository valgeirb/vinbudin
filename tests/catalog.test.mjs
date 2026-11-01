import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as vinbudin from '../dist/index.js'

// Synthetic upstream shape; tests never access the live site.
const beer = (overrides = {}) => ({
  ProductID: 2633,
  ProductName: 'Fixture lager',
  ProductBottledVolume: 330,
  ProductAlchoholVolume: 0,
  ProductPrice: 450,
  ProductFoodCategories: '',
  ProductCategory: {
    Name: 'beer',
    ID: ['60'],
    Taste: true,
    Sweet: false,
    SubCategories: null,
  },
  ProductSubCategory: null,
  ProductCountryOfOrigin: 'Ísland',
  ProductSpecialReserve: false,
  ProductOrganic: false,
  ProductContainerType: 'DS.',
  ProductPlaceOfOrigin: '',
  ProductDistrictOfOrigin: '',
  ProductWine: '',
  ProductInventory: 100,
  ProductYear: '',
  ProductDateOnMarket: '2026-11-05T00:00:00',
  ProductIsTemporaryOnSale: false,
  ProductIsGift: false,
  ProductIsInThema: false,
  ProductIsAvailableInStores: true,
  ProductIsSpecialOrder: false,
  ProductStoreSelected: null,
  ProductTasteGroup: '61BE',
  ProductTasteGroup2: 'PILSNER',
  ProductTasteGroup2Description: null,
  ProductPackagingClosing: '',
  ProductPackagingContainer: 'ALDOS',
  ProductSpecialMarking: [],
  ProductSeasonCode: 'JÓL',
  MinimumQuantity: 0,
  UseMinimumQuantityAsUnit: false,
  IsSpecialOrderAndOutOfStock: false,
  ProductSearchGrape: '',
  ProductProducer: 'Fixture producer',
  ProductShortDescription: 'Fixture beer',
  ProductBackupInventory: 0,
  ProductPackagingWeight: 0,
  ProductCarbonFootprint: 0,
  SupplierId: null,
  ProductAvailableUnits: '1',
  ProductSaleStatus: '1',
  ...overrides,
})
const response = (data, status = 200) =>
  new Response(JSON.stringify({ d: JSON.stringify(data) }), { status })
async function withFetch(handler, run) {
  const original = globalThis.fetch
  globalThis.fetch = handler
  try {
    await run()
  } finally {
    globalThis.fetch = original
  }
}

test('legacy getProducts rejects upstream failures rather than returning an undefined category', async () => {
  await withFetch(
    async () => response({}, 503),
    async () => {
      await assert.rejects(vinbudin.getProducts({ beer: true }), /503/)
    },
  )
})

test('product snapshots retain seasonal/price/release metadata and validate completeness', async () => {
  await withFetch(
    async (url) => {
      assert.equal(new URL(url).searchParams.get('category'), 'beer')
      return response({ total: 1, data: [beer()] })
    },
    async () => {
      const snapshot = await vinbudin.getProductSnapshot('beer')
      assert.equal(snapshot.total, 1)
      assert.equal(snapshot.category, 'beer')
      assert.equal(snapshot.storeCode, null)
      assert.ok(Number.isFinite(Date.parse(snapshot.fetchedAt)))
      assert.equal(snapshot.products[0].productSeasonCode, 'JÓL')
      assert.equal(snapshot.products[0].productPrice, 450)
      assert.equal(snapshot.products[0].productAlchoholVolume, 0)
      assert.equal(
        snapshot.products[0].productDateOnMarket,
        '2026-11-05T00:00:00',
      )
      assert.match(
        snapshot.products[0].productImages.medium,
        /medium\/02633_r.jpg$/,
      )
    },
  )
})

test('snapshot check-start time is captured before invoking fetch', async (t) => {
  const start = new Date('2026-11-01T12:00:00.000Z')
  t.mock.timers.enable({ apis: ['Date'], now: start })

  await withFetch(
    async () => {
      t.mock.timers.setTime(start.getTime() + 1_000)
      return response({ total: 1, data: [beer()] })
    },
    async () => {
      const snapshot = await vinbudin.getProductSnapshot('beer')
      assert.equal(snapshot.fetchedAt, start.toISOString())
    },
  )
})

for (const [name, secondStartOffset] of [
  [
    'overlapping snapshots retain check-start order when the older request finishes last',
    1_000,
  ],
  [
    'snapshots started in the same millisecond retain equal timestamps despite reordered completion',
    0,
  ],
]) {
  test(name, async (t) => {
    const start = new Date('2026-11-01T12:00:00.000Z')
    t.mock.timers.enable({ apis: ['Date'], now: start })
    const pending = []

    await withFetch(
      () => new Promise((resolve) => pending.push(resolve)),
      async () => {
        const olderRequest = vinbudin.getProductSnapshot('beer')
        assert.equal(pending.length, 1)
        t.mock.timers.setTime(start.getTime() + secondStartOffset)
        const newerRequest = vinbudin.getProductSnapshot('beer')
        assert.equal(pending.length, 2)

        t.mock.timers.setTime(start.getTime() + 2_000)
        pending[1](response({ total: 1, data: [beer({ ProductPrice: 500 })] }))
        const newer = await newerRequest

        t.mock.timers.setTime(start.getTime() + 3_000)
        pending[0](response({ total: 1, data: [beer({ ProductPrice: 450 })] }))
        const older = await olderRequest

        assert.equal(older.products[0].productPrice, 450)
        assert.equal(newer.products[0].productPrice, 500)
        assert.equal(older.fetchedAt, start.toISOString())
        assert.equal(
          newer.fetchedAt,
          new Date(start.getTime() + secondStartOffset).toISOString(),
        )
      },
    )
  })
}

test('a store snapshot returns typed stock, including zero, without treating inventory as store stock', async () => {
  await withFetch(
    async (url) => {
      assert.equal(new URL(url).searchParams.get('shop'), '103')
      return response({
        total: 1,
        data: [
          beer({
            ProductStoreSelected: {
              ID: 2,
              Code: '103',
              Name: 'Fixture store',
              Quantity: 0,
              Created: '2020-01-01T00:00:00',
              Modified: '2026-11-01T17:48:23.407',
            },
          }),
        ],
      })
    },
    async () => {
      const snapshot = await vinbudin.getProductSnapshot('beer', {
        storeCode: '103',
      })
      assert.equal(snapshot.storeCode, '103')
      assert.equal(snapshot.products[0].productStoreSelected.quantity, 0)
      assert.equal(
        snapshot.products[0].productStoreSelected.modified,
        '2026-11-01T17:48:23.407',
      )
      assert.equal(snapshot.products[0].productInventory, 100)
    },
  )
})

for (const { name, storeCode, stock, mutate } of [
  {
    name: 'deleting a pending store code cannot relabel a scoped snapshot as global',
    storeCode: '103',
    stock: null,
    mutate: (options) => {
      delete options.storeCode
    },
  },
  {
    name: 'changing a pending store code retains the requested store and validates its stock',
    storeCode: '103',
    stock: {
      ID: 2,
      Code: '103',
      Name: 'Fixture store',
      Quantity: 3,
      Created: '',
      Modified: '',
    },
    mutate: (options) => {
      options.storeCode = '110'
    },
  },
  {
    name: 'adding a store code to a pending global request cannot change its scope',
    storeCode: undefined,
    stock: null,
    mutate: (options) => {
      options.storeCode = '103'
    },
  },
]) {
  test(name, async () => {
    const options = { storeCode }
    let complete
    await withFetch(
      (url) => {
        assert.equal(new URL(url).searchParams.get('shop'), storeCode ?? null)
        return new Promise((resolve) => {
          complete = resolve
        })
      },
      async () => {
        const pending = vinbudin.getProductSnapshot('beer', options)
        assert.equal(typeof complete, 'function')
        mutate(options)
        complete(
          response({ total: 1, data: [beer({ ProductStoreSelected: stock })] }),
        )
        const snapshot = await pending
        assert.equal(snapshot.storeCode, storeCode ?? null)
        assert.equal(
          snapshot.products[0].productStoreSelected?.code ?? null,
          stock?.Code ?? null,
        )
      },
    )
  })
}

for (const [name, data] of [
  ['truncated response', { total: 2, data: [beer()] }],
  ['duplicate product IDs', { total: 2, data: [beer(), beer()] }],
  ['missing total', { data: [beer()] }],
  ['invalid product', { total: 1, data: [beer({ ProductPrice: 'unknown' })] }],
  [
    'wrong category',
    {
      total: 1,
      data: [
        beer({
          ProductCategory: {
            Name: 'red',
            ID: ['1'],
            Taste: true,
            Sweet: false,
            SubCategories: null,
          },
        }),
      ],
    },
  ],
  [
    'invalid stock quantity',
    {
      total: 1,
      data: [
        beer({
          ProductStoreSelected: {
            ID: 2,
            Code: '103',
            Name: 'Fixture store',
            Quantity: -1,
            Created: '',
            Modified: '',
          },
        }),
      ],
    },
  ],
  [
    'wrong store',
    {
      total: 1,
      data: [
        beer({
          ProductStoreSelected: {
            ID: 7,
            Code: '110',
            Name: 'Wrong store',
            Quantity: 3,
            Created: '',
            Modified: '',
          },
        }),
      ],
    },
  ],
]) {
  test(`rejects ${name} rather than returning a usable snapshot`, async () => {
    await withFetch(
      async () => response(data),
      async () => {
        await assert.rejects(
          vinbudin.getProductSnapshot('beer', { storeCode: '103' }),
        )
      },
    )
  })
}

test('an actually empty category is distinct from a failed request', async () => {
  await withFetch(
    async () => response({ total: 0, data: [] }),
    async () => {
      assert.deepEqual((await vinbudin.getProducts({ beer: true })).beer, [])
    },
  )
})

test('stores expose stable codes and geographic data without unrelated contact details', async () => {
  await withFetch(
    async (url) => {
      assert.match(url, /GetAllShops$/)
      return response([
        {
          PostCode: '103',
          Name: 'Fixture store',
          Address: 'Fixture address',
          GPSN: '64.1',
          GPSW: '-21.8',
          Email: 'not-needed@example.com',
        },
      ])
    },
    async () => {
      assert.deepEqual(await vinbudin.getStores(), [
        {
          code: '103',
          name: 'Fixture store',
          address: 'Fixture address',
          latitude: 64.1,
          longitude: -21.8,
        },
      ])
    },
  )
})

test('invalid request options fail without fetching', async () => {
  await withFetch(
    () => {
      assert.fail('must not fetch')
    },
    async () => {
      await assert.rejects(vinbudin.getProductSnapshot('not-a-category'))
      await assert.rejects(
        vinbudin.getProductSnapshot('beer', { storeCode: '103&category=red' }),
      )
      await assert.rejects(
        vinbudin.getProductSnapshot('beer', { storeCode: 103 }),
      )
    },
  )
})

test('an aborted request rejects instead of being logged and swallowed', async () => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(
    vinbudin.getProductSnapshot('beer', { signal: controller.signal }),
  )
})

test('timeouts cancel the underlying request', async () => {
  await withFetch(
    (_url, options) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener(
          'abort',
          () => reject(new Error('Timed out')),
          { once: true },
        )
      }),
    async () => {
      await assert.rejects(
        vinbudin.getProductSnapshot('beer', { timeoutMs: 5 }),
        /Timed out/,
      )
    },
  )
})

test('malformed envelopes reject instead of resembling an empty category', async () => {
  await withFetch(
    async () => new Response(JSON.stringify({ data: [] })),
    async () => {
      await assert.rejects(vinbudin.getProductSnapshot('beer'), /envelope/)
    },
  )
})

test('duplicate store codes cannot produce an ambiguous store picker', async () => {
  const store = {
    PostCode: '103',
    Name: 'Fixture',
    Address: '',
    GPSN: '',
    GPSW: '',
  }
  await withFetch(
    async () => response([store, store]),
    async () => {
      await assert.rejects(vinbudin.getStores(), /duplicate store/)
    },
  )
})

test('legacy category options retain their shape and do not fetch unselected categories', async () => {
  let requests = 0
  await withFetch(
    async () => {
      requests++
      return response({ total: 1, data: [beer()] })
    },
    async () => {
      assert.deepEqual(
        Object.keys(await vinbudin.getProducts({ beer: true, red: false })),
        ['beer'],
      )
      assert.equal(requests, 1)
    },
  )
})
