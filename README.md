# css-autoprefixer

css-autoprefixer is an extension for the code editor CodeTasty that adds prefixes to css files upon saving and can be also used as plugin for less/scss compiler.


### Options

Options can be set in the first line of the edited file:

    /* plugin: css-autoprefixer, out: style.prefixed.css */

out: prefixed file destination

    /* out: ., app.css, ../style.css */

plugin: enables autoprefixer, can be used in less/css compiler options

    /* plugin: css-autoprefixer */