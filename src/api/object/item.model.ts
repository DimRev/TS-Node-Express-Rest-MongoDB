import mongoose, { Document, Schema } from "mongoose";
import z from "zod";

// Item shape
export interface IItem {
  name: string
  country: string
}

export interface IItemModel extends IItem, Document {

}

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
  }, {
  versionKey: false
}
)

// Item with mongoose methods
export default mongoose.model<IItemModel>('Item', ItemSchema)


// Input schemas
export function itemCreateInputValidation(itemToValidate: IItem): IItem {
  const itemCreateInputSchema = z.object({
    country: z.string({ invalid_type_error: "country should be a string" })
      .min(1, "must contain at least 1 character"),
    name: z.string({ invalid_type_error: "name should be a string" })
      .min(1, "must contain at least one character")
  })

  return itemCreateInputSchema.parse(itemToValidate)
}

export function itemUpdateInputValidation(itemToValidate: Partial<IItem>): Partial<IItem> {
  const itemUpdateInputSchema = z.object({
    country: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
  })

  return itemUpdateInputSchema.parse(itemToValidate)
}