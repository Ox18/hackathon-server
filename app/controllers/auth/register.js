const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')

const { handleError } = require('../../middleware/utils')
const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')

const managerStorage = require('../../services/storage')


/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    let avatar = null
    
    const doesEmailExists = await emailExists(req.email)
    if (!doesEmailExists) {
      if( req.files ){
        avatar = req.files.avatar
        console.log(avatar)
        const {mime, ext} = await managerStorage.getFile(avatar.name)
        req = matchedData(req)
        req.avatar = await managerStorage.saveFile( avatar.data, ext )
      }
      const item = await registerUser(req)
      const userInfo = await setUserInfo(item)
      const response = await returnRegisterToken(item, userInfo)
      sendRegistrationEmailMessage(locale, item)
      res.status(201).json(response)
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { register }
