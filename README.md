## NOT IMPLEMETED YET

This tool is not implemented yet, this is a first pass at the main spec. If you are interested in this project, feel free to email me: jeremy.chone@gmail.com.

## Description

**laydown** is simple way to slice your or 3rd party code in layers (i.e., set of files) and easily share them to boostrap or augument existing projects. Not every reusable codes had to become a library or framework. Think of it as a scaffolder that does not know what it scaffolds, any project can become a part of a scaffolding for another project.

## Install 

```
sudo npm install -g laydown
```

This will install the `lay` command line tool.

## Story

This is just a story, it did not happen... yet. Story of a developer, gool-guy, that wants to start a new web project quickly with some small but robust and scalable code.

> Cool, got a new project, I need a quick way to start a lean web app, and I would love to be able to scaffold one quickly. 

> Just heard about`laydown`, which seems to be a generic "scaffolding" tools that can turn any project to a scaffolding source. 

```sh
$ sudo npm install -g laydown
laydown 0.1.0 installed, start with 'lay ?'
```

> Fair enough.

```sh 
$ lay ?
laydown version 0.1.0 help:
Getting started: 
  - 'lay source git://github.com/laydown-io/lean-web-app' to setup the 'lean-web-app' source alias.
  - 'lay down lean-web-app base' to download the 'base' layer from the 'lean-web-app' source.
  - 'lay desc lean-web-app' to describe the layers of this source.
  - 'lay ??' to open "https://laydown.io"
Commands: 
  - "lay source _origin_ [_optional_source_name_]": add a named source name alias to an origin (source_name required if not in the origin laydown.json.
  - "lay down _source_": download a layer from a source (source name or origin).
  - "lay add _source_ _layer_name_ _files_": Create or add to an existing layer.
  - "lay desc _source_ [_layer_name_]": Describe a source or layer.
  - "lay ? _command_name_" to get more info on a command.
```

> Cool, let me try the two first commands.

```sh
$ lay source git://github.com/laydown-io/lean-web-app
$ lay down lean-web-app base
Layer 'base' downloaded
  From  : lean-web-app: 'git://github.com/laydown-io/lean-web-app/laydown.json'
  To    : `./`
  Files :
    - packages.json (added)
    - tsconfig.json (added)
    - build/scripts.js (added)
    - src/main.ts (added)
    - src/view/MainView.ts (added)
    - src/view/MainView.pcss test/test-main.ts (added)
    - mocha.opts (added)
    - web/index.html (updated)
  Description:
    This is the minimum set of files to get a lean web app running. Do a "npm install" "npm run build" "npm start -w"
```

> Let me give it a try. 

```sh
$ npm install
# ...module installed message...
$ npm run build
# ...building ...
$ npm start
# ... start the app and launch browser to localhost:8008/...
```

> Wow, that's launch my browser, and I have a first "hello world", and now it is my code, nothing else to do. 

> Wonder if there are other cool layers in this source. 

```sh
$ lay ? lean-web-app
Description for 'lean-web-app' (https://github.com/laydown-io/lean-web-app) source: 
  Layers: 
    - 'base' : Base code layer for a first hello world using framework ..., post-css, and build scripts ..., ...
    - 'base-material' : Minimalist google base material postcss mixins than you can reuse in your app code
    - 'data' : Simple and extensible data layer based on a Data Service Object model. Contains a DsoMem for quick prototyping, and DsoRemote base class for remote access
    - 'route' : Simple routing emitter based on the mvdom pub/sub
  Description: 
    Lean but scallable web application base on typescript, postcss, mvdom, handlebars with some basic google material styles. Great to start new advanced business or consumer web application.
```

> Interesting, let me download the 'base-material' and 'data' layers.

```sh
$ lay down lay-web-app base-material data
Layers 'base-material' and 'data' from 'lean-web-app' downloaded.
Layer 'base-material':
  Files:
    - pcss/base-material.pcss (added)
    - pcss/base-material-demo.pcss (added)
    - web/demo/base-material-demo.html (added)
  Description:
    Minimalist google base material postcss mixins than you can reuse in your app code
Layer 'data':
  Files:
    - src/data/ds.ts (added)
    - src/data/DsoMem.ts (added)
    - src/data/DsoRemote.ts (added)
    - test/data/test-ds-mem.ts (added)
  Description:
    Simple and extensible data layer based on a Data Service Object model. Contains a DsoMem for quick prototyping, and DsoRemote base class for remote access
```

> hum, what are those data files, let me get more information. 

```sh
$ lay desc lay-web-app data
Layer "data-layer": 
  Files:
    - "src/data/ds.ts": Use it as ds.dso(PeopeDso), which will manage the PeopleDso object as a singleton (create only the first time called)
    - "src/data/DsoMem": You can stend your own class from the DsoMem as "class Contact extends DsoMem<number>" (where number is the id type)
    - "src/data/DsoRemote": Same as the DsoMem, but used REST calls to get data from server. 
    - "test/data/test-ds-mem.ts": Unit test that test the ds and DsoMem (test can be run with -g test-ds-mem. 
  Description: 
    Simple and extensible data layer based on a Data Service Object model. Contains a DsoMem for quick prototyping, and DsoRemote base class for remote access
  Readme provided: 
    'lay read lay-web-app data' to open page in browser or
    'lay show lay-web-app data' to show readme raw content in terminal
```

> Cool, let me read the readme, and then, get some work done. 

> Ok, now, I am ready to make my own layer about a little .ts/.pcss component I did. 

```sh
lay add ./ toggle src/elem/toggle/toggle.ts src/elem/toggle/toggle.pcss
Layer 'toggle' created:
  In    : `./laydown.json`
  Files :
    - src/elem/toggle/toggle.ts
    - src/elem/toggle/toggle.pcss
```

> Let me check that it created. 

```sh
$ cat ./laydown.json
{
  "layers": {
    "toggle": {
      "files:" [
        "src/elem/toggle/toggle.ts",
        "src/elem/toggle/toggle.pcss"
      ]
    }
  }
}
```

> cool, let me push to my repo, and share it with my only and lonely friend. 

> email to friend "hey friend, did a little simple toggle component, feel free to download the code and make it yours. Just do a `lay down git://github.com/cool-guy/cool-web-app toggle` and you should be all set. Best."

## Notes

- All commands listed here are in flux right now and not even in sync between the doc side and the story side (to experiment with different ways). 
- Will probably have a ~/.laydown/lay.opts to set default.
- uri: first will be http/https, but will support git later. 
- github website URLs will be transparently converted behind the scene to the raw content ones (to avoid users to get the raw urls). Later we might give some hooks to provide custom uri transformers.

## Other examples

```
$ lay source https://github.com/cool-guy/cool-web-app
Error: This laydown file (https://github.com/cool-guy/cool-web-app/laydown.json) does not have a name property, name it when sourcing (i.e. 'lay source https://github.com/cool-guy/cool-web-app cool-web-app`)
```

```
$ lay source https://github.com/cool-guy/cool-web-app
Error: Sorry, the "cool-web-app" source name from (https://github.com/cool-guy/cool-web-app/laydown.json) already exist in `~/.laydown/sources.json`)
```

```
$ lay source https://github.com/cool-guy/cool-web-app cool-web-app -dir ./
Source "cool-web-app: https://github.com/cool-guy/cool-web-app" added to './laydown-sources.json'
FYI: the 'cool-web-app' source name is already defined in './.laydown/sources.json' pointing to .... (this ./laydown-sources.json will take precedence)
```

```
$ lay down my-templates svg-icons -log:json | npm run scale-icons
```


~/.laydown/sources.json
```
{
  sources: {
    "my-laydown-sources": {
      origin: "git://my-project/my-laydown-sources.json"
    }
  }
}
```

https://cool-site.com/other-project/other-laydown.json 
```
{
  layers: {
    network: {
      files: [
        "src/network-io.ts",
        "src/network-rpc.ts"
      ]
    }
  }
}
```

lay source git://github.com/toto/coolPublicProject coolPublicProject

curl https://stephane.io/laydown-layers-for-coolPublicProject.json | lay down coolPublicProject someCoolLayer


```
lay create ./ my-material-css
lay set-origin my-material-css git://github.com/google/material-design-lite -git-branch experimental
lay add base src/_mixins.scss src/styleguide.scss
```

./laydown.json
```
{
  name: "my-material-css",
  extends: "https://github.com/google/material-design-lite",
  layers: {
    "base": {
      files: [
        "src/_mixins.scss",
        "src/styleguide.scss"
      ]
    }
  }
}
```

~/dropbox/jeremychone/laydown-material.json

```
lay down ~/dropbox/jeremychone/laydown-material.json base
```

```
lay source ~/dropbox/jeremychone/laydown-material.json jeremy-smart-stuff
```

```
lay publish cool-materials
```

