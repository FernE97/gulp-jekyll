/**
 * Dependencies
 **********************************************************/

var gulp = require('gulp'),
    webp = require('gulp-webp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    changed = require('gulp-changed'),
    tinypng = require('gulp-tinypng'),
    imagemin = require('gulp-imagemin'),
    rubySass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer');


/**
 * File Paths (relative to assets folder)
 **********************************************************/

 var paths = {
    sassSrc : ['assets/scss/**/*.scss', '!assets/scss/**/_*.scss'],
    cssDest : 'assets/css',
    jsHintSrc : [
        'assets/js/main.js'
    ],
    jsMinifySrc : [ // non-concatenated
        'assets/js/vendor/modernizr.js'
    ],
    jsConcatSrc : [
        'assets/js/main.js'
    ],
    jsDest : 'assets/js/build',
    pngSrc : ['assets/img/**/*.png', '!assets/img/build/**/*'],
    jpgSrc : ['assets/img/**/*.jpg', 'assets/img/**/*.jpeg', '!assets/img/build/**/*'],
    gifSrc : ['assets/img/**/*.gif', '!assets/img/build/**/*'],
    imgSrc : ['assets/img/**/*.jpg', 'assets/img/**/*.jpeg', 'assets/img/**/*.gif', '!assets/img/build/**/*'],
    imgDest : 'assets/img/build',
    webpDest: 'assets/img/build/webp'
};


/**
 * Config
 **********************************************************/

/**
 * custom-config.js is used to store configuration settings
 * that shouldn't be kept in sync with everyone else. This
 * file is ignored by git.
 */

var customConfig = require('./custom-config'),
    tinypngApiKey = customConfig.tinypngApiKey,
    serverHost = customConfig.serverHost,
    serverPort = customConfig.serverPort;

var config = {
    serverHost : serverHost,
    serverPort : serverPort,
    webpEnable : false,
    tinypng : tinypngApiKey // https://tinypng.com/developers
};


/**
 * Browser Sync
 **********************************************************/

gulp.task('browser-sync', function() {

    // If server host is not set run a static-server
    if (config.serverHost == '') {
        browserSync.init(['_site/assets/css/*.css', '_site/**/*.html'], {
            server: {
                baseDir: '_site'
            }
        });
    } else {
        browserSync.init(['_site/assets/css/*.css', '_site/**/*.html'], {
            proxy: {
                host: config.serverHost
            }
        });
    }

});


/**
 * Sass Tasks
 **********************************************************/

gulp.task('sass', function() {
    gulp.src(paths.sassSrc)
        .pipe(rubySass({ style: 'expanded', compass: true }))
        .pipe(autoprefixer(
            'last 2 version',
            '> 1%',
            'ie 8',
            'ie 9',
            'ios 6',
            'android 4'
        ))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.cssDest));
});


/**
 * JavaScript Tasks
 **********************************************************/

// JSHint custom js
gulp.task('js-hint', function() {
    gulp.src(paths.jsHintSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish));
});

// Minify all js files that should not be concatenated
gulp.task('js-uglify', function() {
    gulp.src(paths.jsMinifySrc)
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.jsDest));
});

// Minify and concatenate all other js
gulp.task('js-concat', function() {
    gulp.src(paths.jsConcatSrc)
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(paths.jsDest));
});


/**
 * Compress Images
 **********************************************************/

gulp.task('images', function() {

    // ImageMin for jpg and gifs
    gulp.src(paths.imgSrc)
        .pipe(changed(paths.imgDest))
        .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.imgDest));

    // Use TinyPNG if API Key is entered otherwise use ImageMin
    if (config.tinypng != '') {
        gulp.src(paths.pngSrc)
            .pipe(changed(paths.imgDest))
            .pipe(tinypng(config.tinypng))
            .pipe(gulp.dest(paths.imgDest));
    } else {
        gulp.src(paths.pngSrc)
            .pipe(changed(paths.imgDest))
            .pipe(imagemin({ optimizationLevel: 7 }))
            .pipe(gulp.dest(paths.imgDest));
    }

    // Create WebP images if enabled
    if (config.webpEnable != false) {
        gulp.src(paths.jpgSrc)
            .pipe(changed(paths.imgDest))
            .pipe(webp())
            .pipe(gulp.dest(paths.webpDest));
    }

});


/**
 * Gulp Tasks
 **********************************************************/

  // Jekyll
gulp.task('jekyll', function() {
    require('child_process').spawn('jekyll', ['build'], {stdio: 'inherit'});
});

// Watch for file changes
gulp.task('watch', function() {
    gulp.watch([paths.sassSrc, 'assets/scss/**/_*.scss'], ['sass']);
    gulp.watch(paths.jsHintSrc, ['js-hint']);
    gulp.watch(paths.jsMinifySrc, ['js-uglify']);
    gulp.watch(paths.jsConcatSrc, ['js-concat']);
    gulp.watch(paths.jpgSrc, ['images']);
    gulp.watch(paths.pngSrc, ['images']);
    gulp.watch(['assets/css/*.css', '**/*.html', '!_site/**/*.html', '**/*.markdown'], ['jekyll']);
});

// Default task
gulp.task('default', ['sass', 'js-hint', 'js-uglify', 'js-concat', 'images', 'jekyll', 'browser-sync', 'watch']);
