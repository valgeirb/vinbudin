#!/usr/bin/env node

import fs from 'fs'
import inquirer from 'inquirer'
import { getProducts } from './index.js'
import { Category, CategoryOptions } from '../types/types.js'

async function promptForOptions() {
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'products',
      message: 'Pick what you want to fetch',
      choices: [
        { name: 'Beers', value: Category.Beer },
        { name: 'Red wines', value: Category.Red },
        { name: 'White wines', value: Category.White },
        { name: 'Rose wines', value: Category.Rose },
        { name: 'Sparkling wines', value: Category.Bubbly },
        { name: 'Dessert wines', value: Category.Fortified },
        {
          name: 'Ciders, fruit and blends',
          value: Category.CiderFruitAndBlends,
        },
        { name: 'Sake and mead', value: Category.SakeAndMead },
        { name: 'Spirits', value: Category.Strong },
        { name: 'Aromatised wine', value: Category.Aromatised },
      ],
      loop: false,
    },
  ])

  const options: CategoryOptions = answers.products.reduce(
    (acc: { [x: string]: boolean }, curr: string | number) => {
      acc[curr] = true

      return acc
    },
    {},
  )

  return options
}

;(async function cli() {
  const options = await promptForOptions()
  const products = await getProducts(options)

  fs.writeFile(
    'products.json',
    JSON.stringify(products, null, 2),
    'utf8',
    (err) => {
      if (err) {
        return console.log(err)
      }

      console.log("Fetch complete, see './products.json'")
    },
  )
})()
