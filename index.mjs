import express from 'express'
import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'

const PORT = 4000

const app = express()

app.use(express.json())

app.post('/upload', (req, res) => {
  res.json({ status: 'success' })
})

app.get('/process', (req, res) => {
  console.log(process.cwd())

  process.chdir('/tmp')

  // process.exit(1);
  process.on('exit', () => {
    console.log('exit')
  })

  res.json({ status: 'success' })
})

app.get('/path', (req, res) => {
  console.log(path.basename('/foo/bar/baz/asdf/quux.html'))
  console.log(path.basename('/foo/bar/baz/asdf/quux.html', '.html'))
  console.log(path.dirname('/foo/bar/baz/asdf/quux'))
  console.log(path.extname('index.html'))
  console.log(path.extname('index.coffee.md'))

  res.json({ status: 'success' })
})

app.get('/os', (req, res) => {
  console.log(process.env.USER_ID)
  console.log(os.hostname())
  console.log(os.platform())
  console.log('No. CPUs', os.cpus().length)
  console.log('ARQUITECTURA', os.arch())
  console.log(os.release())
  console.log('RAM: ', os.totalmem() / 1024 / 1024 / 1024)
  console.log('RAM Libre: ', os.freemem() / 1024 / 1024)
  console.log('Uptime: ', os.uptime() / 60 / 60)

  res.json({ status: 'success!!!' })
})

app.get('/fs', (req, res) => {
  console.log('INIT el archivo sync')
  const data = fs.readFileSync('./file.txt', 'utf-8')
  console.log(data)
  console.log('END el archivo sync')

  console.log('INIT el archivo async')
  fs.readFile('./file.txt', 'utf-8', (_err, data) => {
    console.log(data)
    console.log('END el archivo async')
  })

  const stats = fs.statSync('./file.txt')
  console.log('size', stats.size)

  res.json({ status: 'success!!!' })
})

app.listen(PORT, () => {
  console.log('run in port: ', PORT)
})
