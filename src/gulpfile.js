let gulp = require('gulp'),
    each = require('gulp-each'),
    filesystem = require('fs'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    tinycolor = require('tinycolor2'),
    exec = require('child_process').exec,
    download = require("gulp-download");

function replaceAll(from, to, text) {
    if (from !== to) {
        console.log('Replacing ' + from + ' for ' + to);
        while(text.match(from)) {
            text = text.replace(from, to);
        }
    }
    return text;
}

function getColors(text) {
    function helper(text, regexp) {
            let arr = [],
                match = true;
            while (match) {
                match = text.match(regexp);
                if (match) {
                    arr.push(match[0]);
                    text = text.slice(match.index+7);
                }
            }
            return arr;
    }
    let arr = helper(text, /#([A-F0-9]){3,8}/i);

    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let orColor = arr[i];
        if (orColor.length > 4 && orColor.length < 7) {
            orColor += '0'.repeat(7 - orColor.length);
        }
        let hex = tinycolor(orColor).toHexString().toUpperCase().slice(0,7);
        if (arr[i].length > 7) hex += arr[i].slice(7).toUpperCase();
        newArr.push([arr[i], hex]);
    }
    return newArr;
}

function mainToVivid(text) {
    let dictMainToVivid = JSON.parse(filesystem.readFileSync('toVivid.json', 'utf8')),
    current = getColors(text);

    for (let i = 0; i < current.length; i++) {
        let hex = current[i][1].slice(0,7);
        if (dictMainToVivid.hasOwnProperty(hex)) {
            let replaceTo = dictMainToVivid[hex];
            if (current[i][1].length > 7) replaceTo += current[i][1].slice(7);
            text = replaceAll(current[i][0], replaceTo, text);
        }
    }
    return text;
}

function toSoft(text, desaturate, lighten, darken) {
    let current = getColors(text);
    for (let i = 0; i < current.length; i++) {
        let hex = tinycolor(current[i][1].slice(0,7)).desaturate(desaturate).lighten(lighten).darken(darken).toHexString().toUpperCase();

        if (current[i][1].length > 7) hex += current[i][1].slice(7);
        text = replaceAll(current[i][0], hex, text);
    }
    return text;
}
function vividToSoft(text) { return toSoft(text, 20, 0, 1); }
function mainToSoft(text) { return toSoft(text, 12, 2, 0); }

function changeColors(content, sufix, fun) {
    content = JSON.parse(content);
    let tokens = JSON.stringify(content['tokenColors']);
    tokens = fun(tokens);
    content['tokenColors'] = JSON.parse(tokens);
    content['name'] += ' ' + sufix;
    return JSON.stringify(content, null, 2); + '\n';
}


gulp.task('mains', function () {
    return gulp.src('OneDark-Pro.json')

        // Output Copy of Main
        .pipe(gulp.dest('../themes/'))

        // From Main theme to Soft
        .pipe(each(function(content, file, callback) {
            content = changeColors(content, 'Soft', mainToSoft)
            callback(null, content);
        }))
        .pipe(rename(function (path) {
            path.basename += '-Soft';
            return path;
        }))
        .pipe(gulp.dest('../themes/'));
});

gulp.task('vivids', function () {
    return gulp.src('OneDark-Pro.json')

        // From Main theme to Vivid
        .pipe(each(function(content, file, callback) {
            content = changeColors(content, 'Vivid', mainToVivid)
            callback(null, content);
        }))
        .pipe(rename(function (path) {
            path.basename += '-Vivid';
            return path;
        }))
        .pipe(gulp.dest('../themes/'))

        // From Vivid to Vivid Soft
        .pipe(each(function(content, file, callback) {
            content = changeColors(content, 'Soft', vividToSoft)
            callback(null, content);
        }))
        .pipe(rename(function (path) {
            path.basename += '-Soft';
            return path;
        }))
        .pipe(gulp.dest('../themes/'));
});

gulp.task('download', function () {
    return download('https://raw.githubusercontent.com/Binaryify/OneDark-Pro/master/themes/OneDark-Pro.json')
        .pipe(gulp.dest('./'));
});

// Default Task - Launch All
gulp.task('default', function(callback) {
  runSequence('download', ['mains', 'vivids'], callback);
});

