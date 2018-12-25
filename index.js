const glob = require('glob')
const fs = require('fs')

const outputFileName = 'out/test.json'

const inputData = []
let outputData

const getName = (path) => path.match(/(in|out)\/source_projects\/(.*)\/project.json/)[2]

glob.sync('in/source_projects/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    const name = getName(route)
    inputData[name] = {
      mapping: {},
      content: JSON.parse(fs.readFileSync(route)),
    }
  })

glob.sync('in/destination_project/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    outputData = JSON.parse(fs.readFileSync(route))
  })

Object.entries(inputData).map(([key, value]) => {
  console.log({ key })
})

const output = {
  ...outputData,
}

console.log(`write ${outputFileName}`)
fs.writeFileSync(outputFileName, JSON.stringify(outputData, null, 2))
