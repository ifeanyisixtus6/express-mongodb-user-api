import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user = await User.create({ firstName, lastName, email, password});

    if(user){
    res.status(201).json({ message: `User created successfully`, firstName: user.firstName, lastName: user.lastName, email: user.email}) ;
    
  } else{
    res.status(404); throw new Error("User data is not valid")
 }
 } catch (error) {
    res.status(500).json({ message: error["message"] });
  }
}


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email or Password is missing!" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } else {
      return res.status(401).json({ error: "Email or Password is not valid" });
    }
  } catch (error) {
    next(error);
  }
};
