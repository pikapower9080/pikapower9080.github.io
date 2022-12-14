// Node.js script to generate a text sitemap for google

const fs = require('fs')
const path = require('path')

const fileExtensions = ['html', 'php']
const ignore = ['.git', '.vscode', 'assets', 'shell.html', 'oldindex.html', '404.html', '.DS_Store', 'popups', 'embed']

function processPath(filePath) {
    return filePath.replace((__dirname + "/"), "https://pikapower9080.github.io/")
    // return filePath
}

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        if (!ignore.includes(file)) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        }
    } else {
        if (!ignore.includes(file) && fileExtensions.includes(file.split('.')[1])) {
            arrayOfFiles.push(processPath(path.join(dirPath, "/", file)))
        }
    }
  })

  return arrayOfFiles
}

fs.writeFileSync('sitemap.txt', getAllFiles(__dirname).join("\n"))