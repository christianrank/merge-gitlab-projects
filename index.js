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

// go through all projects and concatinate entries of each entity into mergedData
Object.entries(inputSourceProjects).map(([projectName, projectData]) => {
  Object.keys(mergedData).forEach((entity) => {
    // keep association of id to old iid and the project name
    const enhancedProjectData = projectData[entity].map((element) => {
      return {
        projectName,
        id: element.id,
        oldIid: element.iid,
        content: element,
      }
    })

    mergedData[entity] = mergedData[entity].concat(enhancedProjectData)
  })
})

Object.keys(mergedData).forEach((entity) => {
  // sort every entity by creation date
  mergedData[entity].sort(orderByCreationDate)

  // assign new iid's
  let iid = 0

  mergedData[entity] = mergedData[entity].map((element) => {
    iid++

    return {
      ...element,
      content: {
        ...element.content,
        iid,
      },
      newIid: iid,
    }
  })
})

// replace iid's in descriptions and notes of issues and merge requests
const projectNamesForRegex = Object.keys(inputSourceProjects).join('|')
const regex = new RegExp(`(${projectNamesForRegex})?(!|#)(\\d+)`, 'g')

const replaceEntityLinks = (projectName, content) => {
  let newContent = content
  const results = []

  let result

  while ((result = regex.exec(content)) !== null) {
    results.push(result)
  }

  if (results.length) {
    results.forEach((result) => {
      let [
        oldLink,
        targetProjectName,
        entityIdentifier,
        oldIid,
      ] = result

      targetProjectName = targetProjectName || projectName
      oldIid = parseInt(oldIid)

      const entity = entityIdentifier === '#' ? 'issues' : 'merge_requests'

      const element = mergedData[entity].find((element) => (
        element.projectName === targetProjectName && element.oldIid === oldIid
      ))

      let newLink

      if (element) {
        newLink = `${entityIdentifier}${element.newIid}`
      } else {
        newLink = '*(invalid link)*'
      }

      newContent = newContent.replace(oldLink, newLink)
    })

    return newContent
  }

  return content
}

Object.entries(mergedData).map(([entity, elements]) => {
  mergedData[entity] = elements.map((element, index) => {
    if (element.content.description) {
      replaceEntityLinks(element.projectName, element.content.description)
    }

    if (element.content.notes) {
      element.content.notes = element.content.notes.map((note) => ({
        ...note,
        note: replaceEntityLinks(element.projectName, note.note),
      }))
    }

    return element
  })
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
