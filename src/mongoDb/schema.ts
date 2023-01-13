import * as  mongoose from 'mongoose';

export const jwtStoreSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, immutable: true },
  sessionId: { type: String, required: true },
  userId: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: String,
  updatedAt: String,
  deletedAt: String,
});

export const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  email: { type: String, required: true, lowercase: true, immutable: true },
  password: { type: String, required: true },
  createdAt: String,
  updatedAt: String,
  deletedAt: String,
});

export const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 10 },
  productNo: String,
  createdAt: String,
  updatedAt: String,
  deletedAt: String,
});

export const orderSchema = new mongoose.Schema({
  User: [
    {
      userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        immutable: true,
      },
    },
  ],

  Products: [
    {
      productId: { type: mongoose.SchemaTypes.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 10 },
      quantity: { type: Number, required: true, min: 1, max: 20 },
      totalPrice: { type: Number, required: true, min: 10 },
    },
  ],
  grandTotal: { type: Number, required: true, min: 10 },
  status: { type: String, required: true },
  createdAt: String,
  updatedAt: String,
  deletedAt: String,
});
