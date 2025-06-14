import User from '../model/userModel.js';
  

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

    // Authorization check: self or admin only
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
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
    if(req.user.id !== req.params.id && req.user.role !== "admin") {
     return res.status(403).json({message: "Unauthorized"})
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({message: "User Updated successfully"})
  } catch (error) {
    res.status(500).json({message: error["message"]});
  }
};

export const deleteUserById = async (req, res) => {
  try {
    if(req.user.id !== req.params.id && req.user.role !== "admin"){
      res.status(403).json({message: "Unauthorized"})
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({message: error["message"]});
  }
};
  