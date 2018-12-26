const glob = require('glob')
const fs = require('fs')

const outputFileName = 'out/project.json'

const inputSourceProjects = []
let inputDestinationProject

// store merged data
const mergedData = {
  issues: [],
  merge_requests: [],
}

// helper functions
const getName = (path) => path.match(/(in|out)\/source_projects\/(.*)\/project.json/)[2]
const orderByCreationDate = (a, b) => new Date(a.content.created_at) - new Date(b.content.created_at)

// get source projects
glob.sync('in/source_projects/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    const name = getName(route)
    const content = JSON.parse(fs.readFileSync(route))

    inputSourceProjects[name] = content
  })

// get the destination project
glob.sync('in/destination_project/*/project.json')
  .map((route) => {
    console.log(`read ${route}`)
    inputDestinationProject = JSON.parse(fs.readFileSync(route))
  })

// go through all projects and contatinate entries of each entity into mergedData
Object.entries(inputSourceProjects).map(([projectName, projectData]) => {
  Object.keys(mergedData).forEach((entity) => {
    mergedData[entity] = mergedData[entity].concat(projectData[entity])
  })
})

Object.keys(mergedData).forEach((entity) => {
  // keep association of id to old iid
  mergedData[entity] = mergedData[entity].map((element) => {
    return {
      id: element.id,
      oldIid: element.iid,
      content: element,
    }
  })

  // sort every entity by creation date
  mergedData[entity].sort(orderByCreationDate)

  // assign new iid's
  let iid = 0

  mergedData[entity] = mergedData[entity].map((element) => {
    iid++

    return {
      ...element,
      element: {
        ...element.content,
        iid,
      },
      newIid: iid,
    }
  })
})

// replace iid's in notes and descriptions of issues and merge requests
const projectNamesForRegex = Object.keys(inputSourceProjects).join('|')
const regex = new RegExp(`/(${projectNamesForRegex})?(!|#)(\\d+)/g`)

Object.keys(mergedData).forEach((entity) => {
  // todo
})

// for the output, we just need element.content
const outputEntityData = {}

Object.entries(mergedData).forEach(([entity, elements]) => {
  outputEntityData[entity] = elements.map((element) => element.content)
})

// create the output
const output = {
  ...inputDestinationProject,
  ...outputEntityData,
}

// write it to the file
console.log(`write ${outputFileName}`)
fs.writeFileSync(outputFileName, JSON.stringify(output, null, 2))
