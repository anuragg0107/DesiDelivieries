const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    // quantity: {
    //   type: String,
    // },
    size: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "cart",
    versionKey: false,
  }
);

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;
