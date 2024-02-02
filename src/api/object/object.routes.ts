import express from 'express'
import objectController from './object.controller'

export const objectRouter = express.Router()

objectRouter.post('/create', objectController.createObject)
objectRouter.get('/get/:objectId', objectController.readObject)
objectRouter.get('/get/', objectController.readAllObjects)
objectRouter.patch('/update/:objectId', objectController.updateObject)
objectRouter.delete('/delete/:objectId', objectController.deleteObject)
