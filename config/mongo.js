const mongoose = require('mongoose')
const loadModels = require('../app/models')

module.exports = ( callback = () => {} ) => {
  const connect = () => {
    mongoose.Promise = global.Promise
    let DB_URL = ''
    // Enable only in development HTTP request logger middleware
    if (process.env.NODE_ENV === 'development') {
      DB_URL = process.env.MONGO_URI
    }else{
      DB_URL = process.env.MONGO_URI_PRODUCTION
    }
    mongoose.connect(
      DB_URL,
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      (err) => {
        let dbStatus = ''
        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
        }
        dbStatus = `**    DB Connection: OK`
        if (process.env.NODE_ENV !== 'test') {
          // Prints initialization
          // console.log('****************************')
          console.log('**    Starting Server')
          console.log(`**    Port: ${process.env.PORT || 3000}`)
          console.log(`**    NODE_ENV: ${process.env.NODE_ENV}`)
          console.log(`**    Database: MongoDB`)
          console.log(dbStatus)
          callback()
        }
      }
    )
    // mongoose.set('useCreateIndex', true)
    // mongoose.set('useFindAndModify', false)
  }
  connect()

  mongoose.connection.on('error', console.log)
  mongoose.connection.on('disconnected', connect)

  loadModels()
}
