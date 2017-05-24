# One Dark Finale

*Vivid*, *Soft*, and *Vivid Soft* theme variations of [OneDark Pro](https://github.com/Binaryify/OneDark-Pro) - for **VSCode**.

**This project won't be updated** and won't keep up with the changes in OneDark Pro. This was more of an experiment than anything else, so it's kind of quick and dirty. To personalize theme variations and more, check out [Themelier](https://github.com/rafamel/themelier).

---

This downloads the latest [OneDark Pro](https://github.com/Binaryify/OneDark-Pro) and programatically builds a *Vivid*, *Soft*, and a *Vivid Soft* variation of that *Atom One Dark* implementation - essentially copying the scoping rules and changing the colors.

It was originally based on [@will-stone](https://github.com/will-stone)'s *One Dark Side*, but is now based on *OneDark Pro* as the previous theme project was abandoned.

I made this as I noticed that even though the color hexs are the same in the VSCode implementations as in the original Atom One Dark theme, they are visibly more desaturated when rendered in Atom. In any case, reading code with any VSCode One Dark theme for a long-ish period of time was a much less pleasant experience than it was in Atom.

The desaturated (*Soft*) versions don't try to exactly replicate the visual appearance in Atom, but instead I tried to make them be as readable and at the same time as long-term not tiring as possible, though they are still very close to the Atom rendering of the themes (the vivid desaturated version differs the most).

# Usage

Download the built extension in the `dist` folder. Go to VSCode and press `ctrl(⌘) + shift + p`, type `Install from VSIX`, return, and choose your downloaded file.

## Build yourself

As I won't be updating the final extension, if you want, you can build it yourself with the latest *OneDark Pro* release, and even play a bit with the color modifications made.

The `src` folder constains a `gulpfile`, wich does all the work.

```
git clone https://github.com/rafamel/one-dark-finale.git
cd one-dark-finale/src
npm install
gulp
```

After npm installing within that folder, gulp will download the latest [OneDark-Pro.json](https://raw.githubusercontent.com/Binaryify/OneDark-Pro/master/themes/OneDark-Pro.json) and generate 4 theme files in the `theme` folder from the original:

* A copy of `OneDark-Pro.json`.
* A softer desaturated/pastel version of that source theme.
* A version with the vivid colors from One Dark Vivid.
* A softer desaturated/pastel version of the Vivid variant.

The color replacements made from the main theme to the soft/desaturated versions are done through the *TinyColor* library, so you can play with the values in the `gulpfile` as much as you like. The color replacements from the main theme to the vivid version are done by reading the corresponding colors from a json ( `src/toVivid.json` ). Color modifications only have an effect over the "tokenColors" key of the theme json (so it doesn't modify the workspace colors).

When you are done playing, you can run `gulp` again to re-build the theme files.

You can then build the extension by installing *vsce* if you haven't yet (`npm install -g vsce`), and then running `vsce package` in the root project folder.
