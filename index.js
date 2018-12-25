const glob = require('glob')
const fs = require('fs')

const outputFileName = 'out/test.json'

const inputData = []
let outputData

glob.sync('in/source_projects/**/*.json')
  .map((route) => {
    console.log(`read ${route}`)
    inputData.push(JSON.parse(fs.readFileSync(route)))
  })

glob.sync('in/destination_project/**/*.json')
  .map((route) => {
    console.log(`read ${route}`)
    outputData = JSON.parse(fs.readFileSync(route))
  })

const output = {
  ...outputData,
}

console.log(`write ${outputFileName}`)
fs.writeFileSync(outputFileName, JSON.stringify(outputData, null, 2))
