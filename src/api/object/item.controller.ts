import { NextFunction, Request, Response } from 'express'
import { MongooseError } from 'mongoose'
import z, { ZodError } from 'zod'
import { IItem, itemCreateInputValidation, itemUpdateInputValidation } from './item.model'
import { itemService } from './item.service'

const createItem = async (req: Request, res: Response, next: NextFunction) => {
  //TODO: Validate input here

  try {
    const itemToCreate: IItem = itemCreateInputValidation(req.body)

    const addedItem = await itemService.create(itemToCreate)
    return res.status(201).send(addedItem)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send({ error: err })
    } else if (err instanceof MongooseError) {
      return res.status(500).send({ error: err })
    } else if (err instanceof Error) {
      return res.status(500).send({ error: err })
    }
  }
}

const readItem = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.itemId

  try {
    const foundItem = await itemService.read(itemId)
    return res.status(200).send(foundItem)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send({ error: err })
    } else if (err instanceof MongooseError) {
      return res.status(500).send({ error: err })
    } else if (err instanceof Error) {
      return res.status(500).send({ error: err })
    }
  }
}

const readAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await itemService.readAll()
    return res.status(200).send(items)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send({ error: err })
    } else if (err instanceof MongooseError) {
      return res.status(500).send({ error: err })
    } else if (err instanceof Error) {
      return res.status(500).send({ error: err })
    }
  }
}

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.itemId

  try {
    const itemToUpdate: Partial<IItem> = itemUpdateInputValidation(req.body)

    const updatedItem = await itemService.update(itemId, itemToUpdate)
    return res.status(200).send(updatedItem)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send({ error: err })
    }
    if (err instanceof ZodError) {
      return res.status(400).send({ error: err })
    } else if (err instanceof MongooseError) {
      return res.status(500).send({ error: err })
    } else if (err instanceof Error) {
      return res.status(500).send({ error: err })
    }
  }
}

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.itemId

  try {
    await itemService.remove(itemId)
    return res.status(201).send(itemId)
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).send({ error: err })
    } else if (err instanceof MongooseError) {
      return res.status(500).send({ error: err })
    } else if (err instanceof Error) {
      return res.status(500).send({ error: err })
    }
  }
}

export default { createItem, readItem, readAllItems, updateItem, deleteItem }