const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const Mime = require('mime')
const {nanoid} = require('nanoid')


/**
 * Checks if given ID is good for MongoDB
 * @param {File} file - id to check
 * @param {string} ext - id to check
 */
exports.saveFile = async (file, ext) => {
  const newName = `${nanoid(15)}${ext}`;
  const original = `${__dirname}/../../public/media/original_${newName}`
  const small = `${__dirname}/../../public/media/small_${newName}`
  const medium = `${__dirname}/../../public/media/medium_${newName}`
  const large = `${__dirname}/../../public/media/large_${newName}`
  return new Promise((resolve, reject) => {
    Jimp.read(file, (err, lenna) => {
      if (err) {
        throw err
      }

      lenna.write(original)
      lenna.resize(200, Jimp.AUTO).write(small)
      lenna.resize(600, Jimp.AUTO).write(medium)
      lenna.resize(1000, Jimp.AUTO).write(large)
      
      resolve(true)
    })
  })
}
/**
 * Get the name of file
 * @param {string} name - name file
 */
exports.getFile = (name = null) => new Promise((resolve, reject) => {
  resolve({
    mime: Mime.getType(name),
    ext: path.extname(name)
  })
})

