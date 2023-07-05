# VertJS

A green-it JavaScript framework

More than a framework, VertJS want to be a toolbox of good practices for Front- and Back-End.

## A front- & back-end framework

The aim of VertJS is to build an optimized website.

The framework is split in different parts :

- compile
  - transpile
    - convert `.ad`, `.md`, `.html` to html files
  - optimize
    - CSS optimization
      - group similar styles
      - generate common styles for all pages in 1 css optimized
      - generate one file per pages of specific styles
      - simplify rules
- serve

## How to test

1. Clone the repo
2. Link with bun "bun link"
3. Create a new empty project
4. `bun init`
5. `bun link vertjs`
6. Create the structure:

- src/index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>VertJS test</title>
  </head>
  <body></body>
  <script type="module" src="index.js"></script>
</html>
```

- src/index.js

7. Test: `bun vertjs`
