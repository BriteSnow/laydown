## NOT IMPLEMETED YET

This tool is not implemented yet, this is a first pass at the main spec. If you are interested in this project, feel free to email me: jeremy.chone@gmail.com.

## Description

**laydown** is simple way to slice your or 3rd party code in layers (i.e., set of files) and easily fetch them to boostrap or agument existing project. Think a scaffolder that does not know what it scaffolds.

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

