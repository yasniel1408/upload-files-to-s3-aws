import { v4 as uuidv4 } from 'uuid'
import multer from 'multer'
import path from 'node:path'
import express from 'express'
import slugify from 'slugify'
const routerMulter = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    const slug = slugify(name, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
      locale: 'es', // language code of the locale to use
      trim: true // trim leading and trailing replacement chars, defaults to `true`
    })

    cb(null, `${slug}-${uuidv4()}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split('/')[1]
  if (type === 'qwer' || type === 'png') {
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

routerMulter.post(
  '/upload-config',
  uploadConf.array('uploaded_file'),
  (req, res) => {
    console.log(req.files)
    res.json({ status: 'success' })
  }
)

// ------------------upload multiple files in multiple fields------------------------------------

const upload = multer({ dest: './uploads/' })

const multiUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
])

routerMulter.post('/upload-two-files', multiUpload, (req, res) => {
  console.log(req.files)
  res.json({ status: 'success' })
})

// -------------------upload multiple files (3)----------------------------------------

routerMulter.post(
  '/upload-multiple',
  upload.array('uploaded_file', 3),
  (req, res) => {
    res.json({ status: 'success' })
  }
)

// ---------------------upload one file-------------------------------------------

routerMulter.post('/upload-one', upload.single('uploaded_file'), (req, res) => {
  res.json({ status: 'success' })
})

export { routerMulter }
