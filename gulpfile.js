
let project_folder = "dist";
let source_folder = "#src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,ico,webp}",
        icon: source_folder + "/img/icon/*.svg",
        fonts: source_folder + "/fonts/**/*",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupmedia = require('gulp-group-css-media-queries');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const svgsprite = require('gulp-svgstore');


function browsersync() {
    browserSync.init({
        server: { baseDir: "./" + project_folder + "/" },
        notify: false,
        online: true
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function htmlwbp() {
    return src(path.watch.html)
        //.pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest("./" + source_folder + "/"))
    //.pipe(browserSync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(groupmedia())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true,
            grid: true
        }))
        .pipe(dest(path.build.css))
        .pipe(cleancss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream())
}

function sprite() {
    return src(path.src.icon)
        .pipe(svgsprite())
        .pipe(rename("sprite.svg"))
        .pipe(dest("./" + source_folder + "/img"))
}

function watchFiles() {
    watch([path.watch.html], html);
    watch([path.watch.css], css);
    watch([path.watch.js], js);
    watch([path.watch.img], images);
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
}

function clean() {
    return del(path.clean);
}

let build = series(clean, parallel(css, html, js, fonts, images));
let watching = parallel(build, watchFiles, browsersync);

exports.fonts = fonts;
exports.sprite = sprite;
exports.htmlwbp = htmlwbp;
exports.images = images;
exports.js = js;
exports.css = css;
exports.clean = clean;
exports.html = html;
exports.build = build;
exports.watching = watching;
exports.default = watching;