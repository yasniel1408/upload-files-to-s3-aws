import AWS from 'aws-sdk'
import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'
import path from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export const s3UploadV2 = async (file) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  const slug = slugify(file.originalname, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: 'es', // language code of the locale to use
    trim: true // trim leading and trailing replacement chars, defaults to `true`
  })

  const ext = path.extname(file.originalname)

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuidv4()}-${slug}${ext}`,
    Body: file.buffer
  }

  return s3.upload(params).promise()
}

export const s3Uploadv3 = async (files) => {
  const s3client = new S3Client()

  const params = files.map((file) => {
    const slug = slugify(file.originalname, {
      replacement: '-', // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
      locale: 'es', // language code of the locale to use
      trim: true // trim leading and trailing replacement chars, defaults to `true`
    })

    const ext = path.extname(file.originalname)
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuidv4()}-${slug}${ext}`,
      Body: file.buffer
    }
  })

  return Promise.all(
    params.map((param) => s3client.send(new PutObjectCommand(param)))
  )
}
