## [gulp.js](http://gulpjs.com/) + [Jekyll](http://jekyllrb.com/) starter template

### Requirements
- Ruby
- Node.js

### Uses gulp plugins for
- [Sass](http://sass-lang.com/) with option for [Compass](http://compass-style.org/)
- [Autoprefixer](https://github.com/ai/autoprefixer)
- [BrowserSync](http://www.browsersync.io/)
- [JSHint](http://jshint.com/)
- [TinyPNG](https://tinypng.com/)
- [image-min](https://www.npmjs.org/package/gulp-imagemin)
- [WebP](https://developers.google.com/speed/webp/)

*As well as a few others to minify and concatenate css and js*

### Setup Instructions

If you don't have node.js installed grab the installer at [nodejs.org](http://nodejs.org/) and install to your system

**Install gulp globally**

```zsh
npm install -g gulp
```

**Install Jekyll**

```zsh
gem install jekyll
```

*All commands below should be run from inside the root of your project directory*

**Run `npm update` to install the gulp dependencies**

```zsh
npm update
```

**Rename `custom-config-sample.js` to `custom-config.js` and add any needed settings**

```zsh
mv custom-config-sample.js custom-config.js
```

**Run `gulp` to start the default gulp tasks**

```zsh
gulp
```
