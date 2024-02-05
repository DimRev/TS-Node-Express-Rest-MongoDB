import express from 'express'
import objectController from './object.controller'
import { loggerService } from '../../services/logger.service'

export const objectRouter = express.Router()

objectRouter.post('/create/', objectController.createObject)
objectRouter.get('/get/:objectId', objectController.readObject)
objectRouter.get('/get/', objectController.readAllObjects)
objectRouter.patch('/update/:objectId', objectController.updateObject)
objectRouter.delete('/delete/:objectId', objectController.deleteObject)
objectRouter.get('/**', (req, res, next) => {
  loggerService.warn('Attempt to access invalid route')
  res.status(400).send({ message: 'Invalid route' })
})
