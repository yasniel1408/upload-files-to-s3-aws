import multer from 'multer'
import express from 'express'
import { s3UploadV2 } from '../services/s3-service.mjs'
const s3Multer = express.Router()

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split('/')[1]
  if (type === 'jpeg' || type === 'png') {
    cb(null, true)
  } else {
    cb(new Error('Invalid Mime Type, only JPEG and PNG'), false)
  }
}

const uploadConf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 } // 2MB
})

s3Multer.post(
  '/upload',
  uploadConf.array('uploaded_file'),
  async (req, res) => {
    const result = await s3UploadV2(req.files[0])
    console.log(result)
    // const results = await s3Uploadv3(req.files)
    // console.log(results)

    // send url to page html
    res.send(`<img src="${result.Location}" />`)
  }
)

export { s3Multer }
