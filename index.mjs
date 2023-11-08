import express from 'express'
import path from 'node:path'
import { routerNode } from './src/routes/node.mjs'
import { routerMulter } from './src/routes/multer.mjs'
import multer from 'multer'
import { s3Multer } from './src/routes/upload-to-s3.mjs'

const PORT = 4000

const app = express()

app.use(express.json())
const startTime = Date.now()
app.use(function (_req, _res, next) {
  console.log('Time: ', startTime)
  next()
})

// servir un html
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'))
})

app.use('/', routerNode)
app.use('/', routerMulter)
app.use('/', s3Multer)

// calcular el tiempo de respuesta en miliseconds
app.use(function (_req, res, next) {
  const endTime = Date.now()
  console.log('Time: ', endTime - startTime, 'ms')
  next()
})
// handle errors
app.use(function (err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ status: 400, message: 'File too large' })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      res
        .status(400)
        .json({ status: 400, message: 'Too many files to upload.' })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ status: 400, message: 'File limit reached' })
    }
  } else {
    console.error(err.stack)
    res.json({ status: err.status, message: err.message })
    next()
  }
})

app.listen(PORT, () => {
  console.log('run in port: ', PORT)
})
