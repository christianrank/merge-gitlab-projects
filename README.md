# merge-gitlab-projects
This script can be used to merge multiple GitLab projects into a single one.

It merges issues and merge requests, assigns new id's and updates the links between them.

It does not run on the GitLab server itself, but modifies the GitLab exports of your projects and creates a new export that you can import as the new project.

Also it does not merge the git repos. It only creates a new project.json. But there are tools out there to do that.

## Howto
1. create a new project on GitLab
1. clone the new project
1. merge your old repos into the new repo using a tool like [tomono](https://github.com/unravelin/tomono) or [monorepo-tools](https://github.com/shopsys/monorepo-tools)
1. export your source projects, unpack them into `in/source_projects`, one folder for each project
   - Example:
      - `in/source_projects/web`
      - `in/source_projects/api`
1. export your destination project, unpack it into `in/destination_project` into a folder
   - Example:
      - `in/destination_project/newproject`
1. run the script. ```node index```
1. the new `project.json` is written to `out/project.json`
1. copy it to your destination project folder, pack it again and import it in GitLab

## Possible improvements
- links to issues and merge requests in the git commit log are not rewritten yet
- `ci_pipelines` and `pipelines` are not merged yet

---

License: MIT
