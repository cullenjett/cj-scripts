require('babel-register')({
  plugins: [
    require.resolve('babel-plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-dynamic-import-node'),
    [
      require.resolve('babel-plugin-import-noop'),
      {
        extensions: ['graphql', 'scss', 'css'],
      },
    ],
  ],
})

process.env.NODE_ENV = 'production'

if (!process.env.PUBLIC_URL) {
  process.env.PUBLIC_URL = ''
}

const cluster = require('cluster')

const { fromAppRoot } = require('../utils/from-app-root')
const app = require(fromAppRoot('/server/app')).default

const PORT = process.env.PORT || 3000

if (cluster.isMaster) {
  console.log(`Master pid: ${process.pid}`)

  const cpuCount = require('os').cpus().length
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`)
    cluster.fork()
  })
} else {
  app.listen(PORT, (err) => {
    if (err) {
      return console.error(err)
    }

    console.log(
      `Server running on port ${PORT} -- Worker pid: ${
        cluster.worker.process.pid
      }`
    )
  })
}
