## NOT IMPLEMETED YET

This tool is not implemented yet, this is a first pass at the main spec. If you are interested in this project, feel free to email me: jeremy.chone@gmail.com.

All commands listed here are in flux right now and not even in sync between the doc side and the story side (to experiment with different ways). The story is the latest thoughts right now (favor default for simplicity, and will have flags to customize). Will probably have a ~/.laydown/lay.opts to set default.

## Description

**laydown** is simple way to slice your or 3rd party code in layers (i.e., set of files) and easily share them to boostrap or augument existing projects. Not every reusable codes had to become a library or framework. Think of it as a scaffolder that does not know what it scaffolds, any project can become a part of a scaffolding for another project.

## Install 

```
sudo npm install -g laydown
```

This will install the `lay` command line tool.

## Add/Create

**Command:**

`lay add source_local_ref layer_name file_paths_space_deliminated`

- _source_local_ref:_ folder path (in this case laydown-layers.json will be added), layers json file, or source name.

**Example**

Assuming we are in the `/project-A/src/common/` folder.

`lay add ../../ data ds.ts dsoMem.ts`

This command will create or update the following file 

`/project-A/laydown-layers.json`
```js
{
  layers: {
    data: {
      files: [
        "src/common/ds.ts",
        "src/common/dsoMem.ts"
      ]
    }
  }
}
```


- The file paths will be relatives to `laydown-layers.json` files.
- More files can be added by using `lay add` with same layer name. 
- Can be removed with `lay remove ../../ data ds.ts` for example. 
- Can list the files like `lay list ../../ data` will list the files in this layers. 

## Download

**Command:**

`lay down source_ref layer_name [out_dir]`

- _source_ref:_ source_local_ref + uri.

**Example:**

`lay down /project-A/ data ./src/data`

will download all of the files specified in the `/demo/laydown-layers.json` "data" layer into the directory `./src/data/` (will create the directory if needed). 

> Note: The source structure is not preserved, just file name. 

## Add a source (aka Alias)

**Format:**

`lay source source_context source_path_or_uri [name_override]`

**Example:**

`lay source ~ /demo/ cool-patterns`

- _source_context:_
  - `.` means is the project local (where we have a .git or the closest `laydown-layers.json` or `laydown-sources.json`)
  - `~` means global to the user will be stored in `~/.laydown/sources.json`
  - `normal/path` can be full path path of a folder or source json file.
- _source_path_or_uri:_ can be URL, local file path, and later git urls as well. 

will create/update the file: 

`~/.laydown/sources.json`

```js
{
  sources: {
    "cool-patterns": {
      origin: "/demo/"
    }
  }
}
```


## Notes

- uri: first will be http/https, but will support git later. 
- github website URLs will be transparently converted behind the scene to the raw content ones (to avoid users to get the raw urls). Later we might give some hooks to provide custom uri transformers.


## Story

This is just a story, it is not real yet. 

```sh
# install a layers repo (just a name pointer to a base dir of a laydown-layers.json or a layers json file)
> lay source https://github.com/cool-patterns
Source "cool-patterns" with origin "https://github.com/cool-patterns" added to "~/laydown/sources.json"

# download the scaffolding for a new typescript-webapp
> lay down cool-patterns web-starter
Layer web-starter from source cool-patterns downloaded:
  - packages.json 
  - tsconfig.json
  - build/scripts.js
  - src/main.ts
  - src/view/MainView.ts
  - src/view/MainView.pcss test/test-main.ts
  - mocha.opts
  - web/index.html

# ... Doing a "npm install" "npm run build" "npm start" ... wow stuff works!! 
# ... Cool, this is my code now, I can play with it.

# ... Now, I would love to have some basic google material styles

> lay down cool-patterns base-material
Layer base-material from source cool-patterns downloaded: 
  - src/pcss/basic-material-demo.pcss
  - src/pcss/basic-materia-mixins.pcss
  - web/base-material-demo.html

# ... "npm run build" "npm start" ... going to http://localhost:8080/base-material-demo.html
# ... Cool, I see the style there that I can use. 

# ... Hum, wonder if this cool-patterns have some data layer to get me started.
> lay desc cool-patterns
Available layers in cool-patterns (https://github.com/cool-patterns)
  - "web-starter" : Base code layer for a first hello world using framework ..., post-css, and build scripts ..., ...
  - "base-material" : Minimalist google base material mixins than you can reuse in your app code
  - "data-layer" : Simple and extensible data layer based on a Data Service Object model. Contains a DsoMem for quick prototyping, and DsoRemote base class for remote access
  - "route" : Simple routing emitter based on the mvdom pub/sub
 

# ... "data-layer" seems to be interesting, let me check it.
> lay desc cool-patterns data-layer
Layer "data-layer": 
  - Description: Simple and extensible data layer based on a Data Service Object model. Contains a DsoMem for quick prototyping, and DsoRemote base class for remote access
  - Files
    - "src/data/ds.ts": Use it as ds.dso(PeopeDso), which will manage the PeopleDso object as a singleton (create only the first time called)
    - "src/data/DsoMem": You can stend your own class from the DsoMem as "class Contact extends DsoMem<number>" (where number is the id type)
    - "src/data/DsoRemote": Same as the DsoMem, but used REST calls to get data from server. 
    - "test/data/test-ds-mem.ts": Unit test that test the ds and DsoMem (test can be run with -g test-ds-mem. 

# ... Interesting let me download this. 
> lay down cool-patterns data-layer
Layer data-layer from source cool-patterns downlaoded:
  - src/data/ds.ts
  - src/data/DsoMem
  - src/data/DsoRemote
  - test/data/test-ds-mem.ts

# ... "npm run build" "npm test -- -g test-ds-mem
# ... ha, I looked at the test/data/test-ds-mem.ts, I get the api, let me give it a try

# ... a long time passed

# ... I created a cool little toggle component, would love to share the code
> lay ?
laydown commands:
  - "lay source ...": add a source name
  - "lay down ...": download a layer
  - "lay add ...": Create or add to an existing layer (from project root try "lay add ./ my-first-layer src/some-file.js src/another-file.js" and check "./laydown-layers.json")

# ... Cool, I want share my cool toggle component
> lay add ./ toggle src/elem/toggle/toggle.ts src/elem/toggle/toggle.pcss
Files added to layer 'toggle' (created) in './laydown-layers.json':
  - src/elem/toggle/toggle.ts
  - src/elem/toggle/toggle.pcss


# ... let me check the newly created ./laydown-layers.json
{
  layers: {
    toggle: {
      files: [
        "src/elem/toggle/toggle.ts",
        "src/elem/toggle/toggle.pcss"
      ]
    }
  }
}

# ... cool, let me share that with my friend

# ... "Hey friend, do a 'lay source https://github.com/cool-guy/cool-project' and then 'lay down cool-project toggle' and that should get you started. Best!"
``` 
