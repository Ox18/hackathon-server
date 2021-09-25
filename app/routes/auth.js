const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const origin = require('../middleware/utils/origin')



const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  login,
  roleAuthorization
} = require('../controllers/auth')

const {
  validateRegister,
  validateVerify,
  validateForgotPassword,
  validateResetPassword,
  validateLogin
} = require('../controllers/auth/validators')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/register', 
origin.checkDomain,
origin.checkTenant,
trimRequest.all, validateRegister, register)

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

/*
 * Forgot password route
 */
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

/*
 * Reset password route
 */
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  origin.checkDomain,
  origin.checkTenant,
  roleAuthorization(['admin','admin_int','manager','inspector']),
  trimRequest.all,
  getRefreshToken
)

/*
 * Login route
 */
router.post(
  '/login', 
  trimRequest.all, 
  origin.checkDomain,
  origin.checkTenant,
  validateLogin, 
  login)

module.exports = router
