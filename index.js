const glob = require('glob')
const fs = require('fs')

const outputFileName = 'out/test.json'

const inputSourceProjects = []
let inputDestinationProject

const mergedData = {
  issues: [],
}

const getName = (path) => path.match(/(in|out)\/source_projects\/(.*)\/project.json/)[2]

const orderByCreationDate = (a, b) => new Date(a.created_at) - new Date(b.created_at)

glob.sync('in/source_projects/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    const name = getName(route)
    inputSourceProjects[name] = {
      mapping: {},
      content: JSON.parse(fs.readFileSync(route)),
    }
  })

glob.sync('in/destination_project/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    inputDestinationProject = JSON.parse(fs.readFileSync(route))
  })

Object.entries(inputSourceProjects).map(([key, value]) => {
  console.log({ key })
  // console.log(value)
  mergedData.issues = mergedData.issues.concat(value.content.issues)
})

mergedData.issues.sort(orderByCreationDate)

console.log({ issueLenght: mergedData.issues.length })

const output = {
  ...inputDestinationProject,
  ...mergedData, // test
}

console.log(`write ${outputFileName}`)
fs.writeFileSync(outputFileName, JSON.stringify(output, null, 2))
