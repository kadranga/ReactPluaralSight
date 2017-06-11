"use strict";

//https://app.pluralsight.com/player?course=react-flux-building-applications&author=cory-house&name=react-flux-building-applications-m2&clip=5&mode=live

var gulp = require('gulp');
var connect = require('gulp-connect');//Run as local dev server
var open = require('gulp-open');//Open a URL web browser
var browserify = require('browserify');//Bundles JS
var reactify = require('reactify');//transform React JSX to JS
var source = require('vinyl-source-stream')// Use conventional text streams with Gulp

var config = {
    port:9005,
    devBaseUrl:'http://localhost',
    paths:{
        html:'./src/*.html',
        js:'./src/**/.js',
        dist:'./dist',
        mainJS: './src/main.js'
    }
}

//Start a local devlopment server
gulp.task('connect', function(){
    connect.server({
        root:['dist'],
        port:config.port,
        base:config.devBaseUrl,
        livereload: true
    });
});

//when you open first run task open
gulp.task('open',['connect'],function(){
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html',function(){
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js',function(){
    browserify(config.paths.mainJS)
        .transform(reactify)
        .bundle()
        .on('error',console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload())
});

gulp.task('watch',function(){
    gulp.watch(config.paths.html,['html']);
    gulp.watch(config.paths.js,['js']);
});

gulp.task('default',['html','js','open','watch']);