import mongoose, { Document, Schema } from "mongoose";

export interface IObject {
  name: string
}

export interface IObjectModel extends IObject, Document {

}

const ObjectSchema = new Schema(
  {
    name: { type: String, required: true }
  }, {
  versionKey: false
}
)

export default mongoose.model<IObjectModel>('Object', ObjectSchema)