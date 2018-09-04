const { rm, ls, which, exec } = require('shelljs')
const colors = require('colors')
const { readFileSync, writeFileSync } = require('fs')

const DelField = (ref, field, prop) => {
  delete ref[field][prop]
  console.log(colors.green(`${field} 字段 ${prop} 属性已删除`))
}

const updatePackageJson = (pkgPath, answers) => {
  const pkg = JSON.parse(readFileSync(pkgPath))
  pkg.main = `dist/${answers.projectName}.umd.js`
  pkg.module = `dist/${answers.projectName}.esm.js`
  pkg.version = '0.0.1'
  DelField(pkg, 'devDependencies', 'shelljs')
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

const initGit = folderPath => {
  if (!which('git')) return
  let gitInitOutput = exec('git init "' + folderPath + '"', {
    silent: true
  }).stdout
  console.log(colors.green(gitInitOutput.replace(/(\n|\r)+/g, '')))
}

module.exports = {
  files: [
    'src',
    'tools',
    'README.md',
    'tsconfig.json',
    'tslint.json',
    '.gitignore'
  ],
  afterInstallCopy: function(answers, folderPath) {
    initGit(folderPath)
  },
  beforeInstallDep: function(answers, folderPath) {
    rm('-rf', `${folderPath}/.steamer`)
    updatePackageJson(`${folderPath}/package.json`, answers)
  }
}
