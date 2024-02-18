import { Category, Fetchers } from '../../types/types.js'
import fetcher from './fetcher.js'

const data: Fetchers = {
  beer: fetcher(Category.Beer),
  red: fetcher(Category.Red),
  white: fetcher(Category.White),
  rose: fetcher(Category.Rose),
  bubbly: fetcher(Category.Bubbly),
  fortified: fetcher(Category.Fortified),
  ciderfruitandblends: fetcher(Category.CiderFruitAndBlends),
  sakeandmead: fetcher(Category.SakeAndMead),
  strong: fetcher(Category.Strong),
  aromatised: fetcher(Category.Aromatised),
}

export default data
