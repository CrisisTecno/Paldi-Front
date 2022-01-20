const glob = require("glob")
const HtmlWebpackPlugin = require("html-webpack-plugin")

console.log("loading html localizer")

function getHtmlFiles(path) {
  const files = glob.sync(`${path}/**/*.html`).filter(v => v.replace(/\\/g, "/").split("/").length > 2)
  for (const file of files) {
    console.log("HTML ", file)
  }
  return files
}

function loadLocale(name) {
  return require(`./locale/${name}`)
}

function generateHtmlWebpackPlugins(files, locale) {
  return files.map(file => new HtmlWebpackPlugin({
    inject: false,
    template: file,
    filename: file.replace("src", "../dist"),
    ...locale,
  }))
}

function getLocalizerPlugins(path, locale, localeExtension={}) {
  const files = getHtmlFiles(path)
  const localeData = {...localeExtension, ...loadLocale(locale)}
  return generateHtmlWebpackPlugins(files, localeData)
}

module.exports = {
  getLocalizerPlugins,
}