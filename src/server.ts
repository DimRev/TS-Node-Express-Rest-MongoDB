import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'

import { objectRouter } from './api/object/object.routes'
import { loggerService } from './services/logger.service'
import { config } from './config/config'


const app = express()

mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    loggerService.info('Connected to MongoDB')
    loggerService.info('Server is loading...')
    startServer()
  })
  .catch((err) => {
    loggerService.error('Unable to connect to MongoDb', err)
    loggerService.error('Shutting down server')
  })

const startServer = () => {

  app.use(cookieParser())
  app.use(express.json())
  app.use(express.static('public'))

  /** SETTING UP CORS */

  if (process.env.NODE_ENV === 'production') {
    loggerService.info(`Server running in production mode`)
    app.use(express.static(path.resolve('public')))
  } else {
    loggerService.info('Server running in development mode')
    const corsOptions = {
      origin: [
        'http://127.0.0.1:3030',
        'http://localhost:3030',
        'http://127.0.0.1:5173',
        'http://localhost:5173'
      ],
      credentials: true,
    }
    app.use(cors(corsOptions))
  }

  /** LOG REQ & RES FROM SERVER - FOR DEBUGGING, COMMENT OUT IF NOT NEEDED */

  app.use((req, res, next) => {
    loggerService.incoming(`Incoming -> Method[${req.method}] - Url: [${req.url}] - IP [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
      loggerService.outgoing(res.statusCode, `Outgoing -> Method[${req.method}] - Url: [${req.url}] - IP [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`)
    })

    next()
  })

  /** RULES OF API */

  app.use((req, res, next) => {
    let path
    if (process.env.NODE_ENV === 'production') {
      path = '*'
    } else {
      path = 'http://localhost:5173'

    }
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173',)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).send({})

    }

    next()
  })

  /** ROUTES */
  app.use('/api/object/', objectRouter)

  /** HEALTHCHECK */
  app.get('/ping', (req, res, next) => res.status(200).send({ message: 'pong' }))

  const port = config.server.port
  app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
  })

  app.listen(port, () => {
    loggerService.info(`Server is running on port: [${port}]`)
  })
}