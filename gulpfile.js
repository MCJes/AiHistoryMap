//init vars

const projectFolder = 'dist'
const srcFolder = 'src'
const fs = require('fs')

const path = {
  build: {
    html: `${projectFolder}/`,
    css: `${projectFolder}/css/`,
    js: `${projectFolder}/js/`,
    img: `${projectFolder}/img/`,
    fonts: `${projectFolder}/fonts/`,
  },
  src: {
    html: `${srcFolder}/html/*.html`,
    scss: `${srcFolder}/scss/style.scss`,
    js: `${srcFolder}/js/script.js`,
    img: `${srcFolder}/img/**/*.+{jpg, png, svg, gif, ico, webp}`,
    fonts: `${srcFolder}/fonts/*.ttf`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    scss: `${srcFolder}/scss/**/*.scss`,
    js: `${srcFolder}/js/**/*.js`,
    img: `${srcFolder}/img/**/*.+{jpg, png, svg, gif, ico, webp}`,
  },
  clean: `./${projectFolder}/`,
}

const { src, dest } = require('gulp')
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const fileInclude = require('gulp-file-include')
const del = require('del')
const scss = require('gulp-sass')
const autoPrefixer = require('gulp-autoprefixer')
const groupMedia = require('gulp-group-css-media-queries')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')
const uglifyJS = require('gulp-uglify-es').default
const babel = require('gulp-babel')
const imageMin = require('gulp-imagemin')
const webp = require('gulp-webp')
const webpHtml = require('gulp-webp-html')
const webpCss = require('gulp-webpcss')
const svgSprite = require('gulp-svg-sprite')
const ttfToWoff = require('gulp-ttf2woff')
const ttfToWoff2 = require('gulp-ttf2woff2')
const fonter = require('gulp-fonter')

//live server
function server() {
  browserSync.init({
    server: {
      baseDir: path.clean,
    },
    port: 3000,
    notyfy: false,
  })
}

function html() {
  return (
    src(path.src.html)
      .pipe(fileInclude())
      //include webP for old browsers
      .pipe(webpHtml())
      .pipe(dest(path.build.html))
      .pipe(browserSync.stream())
  )
}

function css() {
  return src(path.src.scss)
    .pipe(
      scss({
        outputStyle: 'expanded',
      }),
    )
    .pipe(groupMedia())
    .pipe(
      autoPrefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      }),
    )
    .pipe(webpCss())
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: '.min.css',
      }),
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(dest(path.build.js))
    .pipe(uglifyJS())
    .pipe(
      rename({
        extname: '.min.js',
      }),
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream())
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      }),
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imageMin({
        progressive: true,
        svgoPlugins: [{ removeViewBiow: false }],
        interlaced: true,
        optimizationLevel: 3, // 0 to 7
      }),
    )
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream())
}

function fonts() {
  src(path.src.fonts).pipe(ttfToWoff()).pipe(dest(path.build.fonts))
  return src(path.src.fonts).pipe(ttfToWoff2()).pipe(dest(path.build.fonts))
}

gulp.task('svgSprite', () => {
  return gulp
    .src([`${srcFolder}/iconsprite/*.svg`])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg', //spitefile name
            //example: true
          },
        },
      }),
    )
    .pipe(dest(path.build.img))
})

gulp.task('otfConvert', () => {
  return src([`${srcFolder}/fonts/*.otf`])
    .pipe(
      fonter({
        formats: ['ttf'],
      }),
    )
    .pipe(dest(`${srcFolder}/fonts/`))
})

function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss')
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb)
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.')
          fontname = fontname[0]
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + '/scss/fonts.scss',
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb,
            )
          }
          c_fontname = fontname
        }
      }
    })
  }
}

function cb() {}

function watchChanges() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.scss], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.img], images)
}

function clean() {
  return del(path.clean)
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts))
const watch = gulp.parallel(build, watchChanges, server)

exports.watch = watch
exports.default = watch
exports.build = build
exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.fonts = fonts
exports.fontsStyle = fontsStyle
