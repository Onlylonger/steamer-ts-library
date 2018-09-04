const rollup = require('rollup')
const colors = require('colors')
const {
  watchOptions,
  inputOptions,
  umdOutput,
  esOutput
} = require('./build/rollup.config')

const isProduction = process.env.NODE_ENV === 'production'

async function build(inputOptions, outputOptions) {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions)

  console.log(bundle.imports) // an array of external dependencies
  console.log(bundle.exports) // an array of names exported by the entry point
  console.log(bundle.modules) // an array of module objects

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions)

  // or write the bundle to disk
  await bundle.write(outputOptions)
}

if (!isProduction) {
  const watcher = rollup.watch([watchOptions])
  watcher.on('event', event => {
    if (event.code === 'START') {
      console.log(colors.green('监听文件改变.'))
    } else if (event.code === 'BUNDLE_START') {
      // console.log(colors.green('构建单个文件'))
    } else if (event.code === 'BUNDLE_END') {
      // console.log(colors.green('完成文件束构建'))
    } else if (event.code === 'END') {
      console.log(colors.green('文件构建完成.'))
    } else if (event.code === 'ERROR') {
      console.log(colors.red('构建出错.'))
    }
  })

  // 停止监听
  // watcher.close()
} else if (isProduction) {
  build(inputOptions, umdOutput)
  build(inputOptions, esOutput)
}
