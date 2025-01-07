# MiniGame Technologies

Company introduction website, portfolio website

# Technical Stack

- [Node.js] - v14.x
- [Gulp.js] - v4.x
- [Boostrap] - v5.x
- Vanilla JS
- jQuery

# Environment

- [src] - Development
- [dist] - Staging
- [build] - Live

## Installation

```
cd <project-root>/
npm install
npm install --global gulp-cli
```

<br />Development run: `gulp`

- to start serving the files in src directory.

<br />Staging run: `gulp dist`

- to build everything in dist directory.

<br />Production run: `gulp build`

- to build everything in build directory (with versioning).

  \*Build version will increase when run this command -- `src/assets/version/version.js`
