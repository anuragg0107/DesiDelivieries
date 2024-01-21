const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    tokens : [
      {
        token : {
          type : String,
          required : true
        }
      }
    ],
    verifytoken : {
      type : String,

    },
    googleId :{
      type : String,
      required: false,
    },
    image :{
      type : String,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const userModel = mongoose.model('users',userSchema)

module.exports = userModel