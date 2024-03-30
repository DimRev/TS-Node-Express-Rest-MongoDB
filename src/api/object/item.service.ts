import mongoose from 'mongoose'
import Item, { IItem } from './item.model'
import { loggerService } from '../../services/logger.service'

// Mongoose service

export const itemService = {
  create,
  read,
  readAll,
  update,
  remove,
}

async function create({ name, country }: IItem) {
  const itemToAdd = new Item({
    _id: new mongoose.Types.ObjectId(),
    name,
    country
  })
  try {
    const addedItem = await itemToAdd.save()
    loggerService.debug(`Added item: [${addedItem._id}]`)
    return addedItem
  } catch (err) {
    loggerService.error(err)
    throw err
  }
}

async function read(itemId: string) {
  try {
    const foundItem = await Item.findById(itemId)
    if (foundItem) {
      loggerService.debug(`Found item: [${foundItem._id}]`)
      return foundItem
    } else {
      loggerService.error(`Failed to find: [${itemId}]`)
      throw new Error('Failed to read: Item not found')
    }
  } catch (err) {
    loggerService.error(err)
    throw err
  }
}

async function readAll() {
  try {
    const items = await Item.find()
    loggerService.debug(`Found [${items.length}] items`)
    return items
  } catch (err) {
    loggerService.error(err)
    throw err
  }
}

async function update(itemId: string, itemToUpdate: Partial<IItem>) {
  try {
    const item = await Item.findById(itemId)
    if (item) {
      item.set(itemToUpdate)
      const updatedItem = await item.save()
      loggerService.debug(`Updated item: [${updatedItem._id}]`)
      return updatedItem
    } else {
      loggerService.error(`Failed to update, item not found: [${itemId}] `)
      throw new Error('Failed to update: Item not found')
    }
  } catch (err) {
    loggerService.error(err)
    throw err
  }
}

async function remove(itemId: string) {
  try {
    const deletedItem = await Item.findByIdAndDelete(itemId)
    if (deletedItem) {
      loggerService.debug(`Deleted item: [${deletedItem._id}]`)
      return itemId
    } else {
      loggerService.error(`Failed to delete, item not found: [${itemId}]`)
      return new Error('Failed to delete: Item Not found')
    }
  } catch (err) {
    loggerService.error(err)
    throw err
  }
}