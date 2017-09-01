## NOT IMPLEMETED YET

This tool is not implemented yet, this is a first pass at the main spec. If you are interested in this project, feel free to email me: jeremy.chone@gmail.com.

## Description

**laydown** is simple way to slice and reuse code between projects. Not everything has to become a framework, but most need to be reused. 

## Install 

```
sudo npm install -g laydown
```

This will install the `lay` command line tool.

## Usage

#### Adding sources

Adding layers source (globally, ~/.llayers/sources.json) (Must have a `layers.json` at the root)

```
lay -g add-source git@github.com:mvdom/mvdom-patterns.git
```

Add a layer and override the source name

```
lay -g add-source git@github.com:mvdom/mvdom-patterns.git -name good_patterns
```

#### Downloading layers

**Format**: 
```
lay down source_name layer_name [-out path/to/out/dir/]
```

**Example**: 

```
lay down good_patterns data -out src/ts/
```
Download the files from the layer named **data** from the **good_patterns** layers source to the destintation directory **src/ts/** folder.

if `-out ` is omitted then files will be downloaded in the current folder. 

> NOTE: Important, right now the concept is to download files to the destination directory without their source path structure. So, just the file names.

#### Adding files to a local layers.json

```
lay add ./ds*.js, ./test/ds-test.js -layer data
```
Add relative files matching `./ds*.js` and `./test/ds-test.js` to the project `layers.json` for the given name `data`


#### Commands
- `add`: Add one or more file to layers.json
- `add-source`: add a layers source.
- `remove-source`: Remove a source (by name)
- `down`: Download one or more layers (comma delimited) from a named source.

#### Command Options
- `-name`: Override the name of the layers source.
- `-g`: make the command global. Gobal commands will affect the `~/.llayers/`), non global commands will affect `./.llayers`. 
- `-out out_dir`: This force all of the files to be downloaded in a particular folder. 

> TODO: Need to fully bake the -out and -replace. For example, should -out should still follow the layer files' folder structure (will be simpler, but not as flexible when a layers have files in different folders -which we might not recommend-).

> TODO: -replace: How do we do multiple replace? do we allow regex, how? 


## layers.json

> Question: Should would call it `layers.json` no matter the tool name, or should be the `laydown.json` ? Perhaps we put all in a `./laydown/` folder, and have a `./laydown/layers.json`? 


File that contains the layers. 

```js
{
  name: "mvdom-patterns",
  layers: [
    {
      name: "data",
      readme: "layers/data-readme.md",
      files: [
        "src/js-app/ds.ts",
        "src/js-app/dsoMem.ts",
        "src/js-app/dsoRemote.ts"
      ]
    },
    {
      name: "routing"
      files: [
        "src/js-app/route.ts"
      ]
    }
    
  ]
}
```

> Note: We might want to support comments in the .json even if it is not part of the json format. However, this can reduce tooling compatibilities (e.g., showin erroneous in github and probably many editors)

> Note: If we supports comment, editing it via `lay add ...` should preserve comments and formatting as much as possible (the vscode way)
