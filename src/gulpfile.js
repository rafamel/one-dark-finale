var gulp = require('gulp'),
    each = require('gulp-each'),
    filesystem = require('fs'),
    rename = require('gulp-rename'),
    tinycolor = require('tinycolor2');


function replaceAll(from, to, text) {
    if (from !== to) {
        while(text.match(from)) {
            console.log('Replacing ' + from + ' for ' + to);
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
    let re = new RegExp('#([A-F0-9]){3,8}', 'i'),
        arr = helper(text, re);

    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let tColor = tinycolor(arr[i]),
            hex = tColor.toHexString().toUpperCase();
        newArr.push([arr[i], hex]);
    }
    return newArr;
}

function mainToVivid(text) {
    let dictMainToVivid = JSON.parse(filesystem.readFileSync('toVivid.json', 'utf8')),
    current = getColors(text);

    for (let i = 0; i < current.length; i++) {
        text = replaceAll(current[i][0], dictMainToVivid[current[i][1]], text);
    }
    return text;
}

function toSoft(text, desaturate, lighten, darken) {
    let current = getColors(text);
    for (let i = 0; i < current.length; i++) {
        let hex = tinycolor(current[i][1]).desaturate(desaturate).lighten(lighten).darken(darken).toHexString().toUpperCase();
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
    return JSON.stringify(content) + '\n';
}


gulp.task('mains', function () {
  // return gulp.src('OneDark-Pro/themes/*')
    return gulp.src('One-Dark-Side.json')

        // Output Copy of Main
        .pipe(each(function(content, file, callback) {
            // Making clear it is the copied-over version.
            content = JSON.stringify(JSON.parse(content)) + '\n';
            callback(null, content);
        }))
        .pipe(gulp.dest('../themes/'))

        // From Main theme to Soft
        .pipe(each(function(content, file, callback) {
            content = changeColors(content, 'Soft', mainToSoft)
            callback(null, content);
        }))
        .pipe(rename(function (path) {
            path.basename += "-Soft";
            return path;
        }))
        .pipe(gulp.dest('../themes/'));
});

gulp.task('vivids', function () {
    return gulp.src('One-Dark-Side.json')

        // From Main theme to Vivid
        .pipe(each(function(content, file, callback) {
            content = changeColors(content, 'Vivid', mainToVivid)
            callback(null, content);
        }))
        .pipe(rename(function (path) {
            path.basename += "-Vivid";
            return path;
        }))
        .pipe(gulp.dest('../themes/'))

        // From Vivid to Vivid Soft
        .pipe(each(function(content, file, callback) {
            content = changeColors(content, 'Soft', vividToSoft)
            callback(null, content);
        }))
        .pipe(rename(function (path) {
            path.basename += "-Soft";
            return path;
        }))
        .pipe(gulp.dest('../themes/'));
});

// Default and Watch tasks

gulp.task('default', function(callback) {
    gulp.start('mains', 'vivids');
});

gulp.task('watch', function(callback) {
    gulp.start('default');
    gulp.watch('*.json', ['mains', 'vivids']);
});
