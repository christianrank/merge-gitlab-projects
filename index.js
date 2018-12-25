const glob = require('glob')
const fs = require('fs')

const outputFileName = 'out/project.json'

const inputSourceProjects = []
let inputDestinationProject

const mergedData = {
  issues: [],
  merge_requests: [],
  ci_pipelines: [],
  pipelines: [],
}

const getName = (path) => path.match(/(in|out)\/source_projects\/(.*)\/project.json/)[2]

const orderByCreationDate = (a, b) => new Date(a.created_at) - new Date(b.created_at)

glob.sync('in/source_projects/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    const name = getName(route)
    const content = JSON.parse(fs.readFileSync(route))

    const mapping = {}

    Object.keys(mergedData).forEach((entity) => {
      mapping[entity] = {}

      content[entity].map((element) => {
        mapping[entity][element.id] = element.id
      })
    })

    inputSourceProjects[name] = {
      mapping,
      content,
    }
  })

glob.sync('in/destination_project/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    inputDestinationProject = JSON.parse(fs.readFileSync(route))
  })

Object.entries(inputSourceProjects).map(([key, value]) => {
  Object.keys(mergedData).forEach((entity) => {
    mergedData[entity] = mergedData[entity].concat(value.content[entity])
  })
})

mergedData.issues.sort(orderByCreationDate)

Object.keys(mergedData).forEach((entity) => {
  let iid = 0

  mergedData[entity] = mergedData[entity].map((element) => {
    iid++

    return {
      ...element,
      iid,
    }
  })
})

const output = {
  ...inputDestinationProject,
  ...mergedData,
}

console.log(`write ${outputFileName}`)
fs.writeFileSync(outputFileName, JSON.stringify(output, null, 2))
