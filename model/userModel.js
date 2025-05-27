import mongoose from 'mongoose';
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
password: {
    type: String
  }
}, {
  timestamps: true
});

//middleware to hash password before saving
UserSchema.pre("save", async function (next) {
  if(!this.isModified("password"))  return next();
  
  try{
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword;
    console.log("hashedPassword",this.password)
    next(); 
  } catch(error){
    next(error)
  }
})



const User = mongoose.model('User', UserSchema);

export default User
