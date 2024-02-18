import { Listr } from 'listr2'
import categories from './categories/index.js'
import { Category, CategoryData, CategoryOptions } from '../types/types.js'

export const getProducts = async function (
  options: CategoryOptions = {
    beer: true,
    red: true,
    white: true,
    rose: true,
    bubbly: true,
    fortified: true,
    ciderfruitandblends: true,
    sakeandmead: true,
    strong: true,
    aromatised: true,
  },
): Promise<CategoryData> {
  let data: CategoryData = {}
  const availableCategories: Category[] = [
    Category.Beer,
    Category.Red,
    Category.White,
    Category.Rose,
    Category.Bubbly,
    Category.Fortified,
    Category.CiderFruitAndBlends,
    Category.SakeAndMead,
    Category.Strong,
    Category.Aromatised,
  ]

  const tasks = new Listr(
    availableCategories.map((category: Category) => ({
      title: category,
      task: async () => {
        data[category] = await categories[category]()
      },
      skip: () => !options[category],
    })),
    { concurrent: true },
  )

  await tasks.run().catch((err) => {
    console.error('Tasks', err)
  })

  return data
}
