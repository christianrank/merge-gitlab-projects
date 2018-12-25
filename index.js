const glob = require('glob')
const fs = require('fs')

const inputData = []
let outputData

glob.sync('in/**/*.json')
  .map((route) => {
    console.log(`read ${route}`)
    inputData.push(JSON.parse(fs.readFileSync(route)))
  })

glob.sync('out/**/*.json')
  .map((route) => {
    console.log(`read ${route}`)
    outputData = JSON.parse(fs.readFileSync(route))
  })

// console.log(outputData)
