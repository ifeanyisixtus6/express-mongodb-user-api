import User from '../model/userModel.js';
  

export const signUp= async (req, res) => {
  try {
    const { firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user = await User.create({ firstName, lastName, email, password: hashedPassword });

    if(user){
    res.status(201).json({ message: `User created successfully`, firstName: user.firstName, lastName: user.lastName, email: user.email}) ;
    
  } else{
    res.status(404); throw new Error("User data is not valid")
 }
 } catch (error) {
    res.status(500).json({ message: error["message"] });
  }
}


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: error["message"]});
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error["message"]});
  }
};

export const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error["message"]});
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({message: error["message"]});
  }
};

