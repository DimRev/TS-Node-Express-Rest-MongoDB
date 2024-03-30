import express from 'express'
import itemController from './item.controller'
import { loggerService } from '../../services/logger.service'

export const itemRouter = express.Router()

itemRouter.post('/create/', itemController.createItem)
itemRouter.get('/get/:itemId', itemController.readItem)
itemRouter.get('/get/', itemController.readAllItems)
itemRouter.patch('/update/:itemId', itemController.updateItem)
itemRouter.delete('/delete/:itemId', itemController.deleteItem)
itemRouter.get('/**', (req, res, next) => {
  loggerService.warn('Attempt to access invalid route')
  res.status(404).send({ error: 'Invalid route' })
})
