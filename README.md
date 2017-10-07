## EXPERIMENTAL

This tool is not full implemented, and while it kind of work for personal use, it is still in flux.If you are interested in this project, feel free to email me: jeremy.chone@gmail.com.

## Description

**laydown** is simple way to slice your or 3rd party code in layers (i.e., set of files) that can be easily 'laid down' in other project. Not every reusable codes had to become a library or framework. Think of it as a scaffolder that does not know what it scaffolds, any project can become a part of a scaffolding for another project.

## Install 

```
sudo npm install -g laydown
```

This will install the `lay` command line tool.

## usage

```sh
$ sudo npm install -g laydown
```


``` 
$ lay ?
  - `lay init [_base_dir_]` create a './laydown.json' with a optional base dir.
  - `lay add _layer_name_ _files,..._`: add a layer (if does not exists) and append files. (use the closest laydown.json)
  - `lay desc _layer_name_` describe a layer (use the closest laydown.json)
  - `lay down /path/to/laydown/dir/ _layer_name_ [_dist_dir_]` download the layer's files for a laydown file into a optional dist_dir (default dist_dir: './')
```
