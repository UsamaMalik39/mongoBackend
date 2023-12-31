const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema(
  {
    _id : {
        type : String
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted : {
        type : Boolean,
        required : true,
        default : false
    } 
  },
  { collection: 'Users' , timestamps : true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('Users', userSchema);

module.exports = User;
