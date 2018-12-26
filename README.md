# merge-gitlab-projects

## Requirements
`// Todo`

## How to do the thing
`// Todo`

## Todo
- [ ] build `iid` mapping for
  - [x] `issues`
    - [ ] `milestone`
  - [x] `merge_requests`
    - [ ] `milestone`
  - [x] `ci_pipelines`
  - [x] `pipelines`
- [ ] replace iid's in notes and descriptions of issues and merge requests
  - [ ] `issues[].description` and `merge_requests[].description`
    - [ ] issues: `#iid` or `project#iid`
    - [ ] merge requests: `!iid` or `project!iid`
  - [ ] `issues[].notes[].note` and `merge_requests[].notes[].note`
    - [ ] `mentioned in merge request !iid`
    - [ ] `closed via merge request !iid`


## Possible improvements
- What about links to issues and merge requests in the git commit log? This is not rewritten yet.

---

License: MIT
