import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Object from './object.model'
import { loggerService } from '../../services/logger.service'

const createObject = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body
  const objectToAdd = new Object({
    _id: new mongoose.Types.ObjectId(),
    name
  })

  try {
    const addedObject = await objectToAdd.save()
    return res.status(201).send({ object: addedObject })
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const readObject = async (req: Request, res: Response, next: NextFunction) => {
  const objectId = req.params.objectId
  console.log(objectId)

  try {
    const foundObject = await Object.findById(objectId)
    if (foundObject) {
      return res.status(200).send({ object: foundObject })
    } else {
      loggerService.error({ message: 'Object not found', objectId: objectId })
      return res.status(404).send({ message: 'Object not found', objectId: objectId })
    }
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const readAllObjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const objects = await Object.find()
    return res.status(200).send({ objects })
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const updateObject = async (req: Request, res: Response, next: NextFunction) => {
  const objectId = req.params.objectId

  try {
    const object = await Object.findById(objectId)
    if (object) {
      object.set(req.body)
      const updatedObject = await object.save()
      return res.status(200).send({ object: updatedObject })
    } else {
      loggerService.error({ message: 'Not found', objectId: objectId })
      return res.status(404).send({ message: 'Not found', objectId: objectId })
    }
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

const deleteObject = async (req: Request, res: Response, next: NextFunction) => {
  const objectId = req.params.objectId

  try {
    const deletedObject = await Object.findByIdAndDelete(objectId)
    if (deletedObject) {
      return res.status(201).send({ message: 'Deleted', objectId: objectId })
    } else {
      loggerService.error({ message: 'Not found', objectId: objectId })
      return res.status(404).send({ message: 'Not found', objectId: objectId })
    }
  } catch (err) {
    loggerService.error(err)
    return res.status(500).send({ err })
  }
}

export default { createObject, readObject, readAllObjects, updateObject, deleteObject }