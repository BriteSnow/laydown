## EXPERIMENTAL

This tool is not full implemented, and while it kind of work for personal use, it is still in flux.If you are interested in this project, feel free to email me: jeremy.chone@gmail.com.

## Description

**laydown** is simple way to slice your or 3rd party code in layers (i.e., set of files) that can be easily 'laid down' in other project. Not every reusable codes had to become a library or framework. Think of it as a scaffolder that does not know what it scaffolds, any project can become a part of a scaffolding for another project.

## Install 

```
sudo npm install -g laydown
```

This will install the `lay` command line tool.

## Story

```sh
$ sudo npm install -g laydown
laydown 0.1.0 installed, start with 'lay ?'
```

> Fair enough.

```sh 
$ lay ?
laydown version 0.1.0 help:
Getting started: 
  - 'lay add-source git://github.com/laydown-io/lean-web-app' to setup the 'lean-web-app' source alias.
  - 'lay down lean-web-app base' to download the 'base' layer from the 'lean-web-app' source.
  - 'lay desc lean-web-app' to describe the layers of this source.
  - 'lay ??' to open "https://laydown.io"
Commands: 
  - "lay source _origin_ [_optional_source_name_]": add a named source name alias to an origin (source_name required if not in the origin laydown.json.
  - "lay down _layer_name_ [_dist_folder_]": download a layer from a source (source name or origin).
  - "lay add _layer_name_ _files..._": Create or add to an existing layer.
  - "lay desc [_layer_name_]": Describe a source or layer.
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

