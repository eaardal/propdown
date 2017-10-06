# Propdown

> Recursively finds all JSX files in the target directory and parses them to markdown using [react-docgen](https://github.com/reactjs/react-docgen) and [react-docgen-markdown-renderer](https://github.com/OriR/react-docgen-markdown-renderer)

## Install

```
npm i -D propdown
```

## Use

Run with node:

```
node node_modules/propdown/lib/index.js
```

### Options

#### `src`

Specify the source directory to recursively search for .jsx files

```
node node_modules/propdown/lib/index.js --src=my/source/folder
```

#### `out`

Specify the target directory to put processed markdown files

```
node node_modules/propdown/lib/index.js --out=my/docs/folder
```

#### `verbose`

Specify to log more verbosely when running

```
node node_modules/propdown/lib/index.js --verbose
```

## Changelog

See [Changelog](./CHANGELOG.md)
