import User from '../model/userModel.js';
  

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json(users);
  } catch (error) {
    next(error) 
};

}

export const getUserById = async (req, res, next) => {
  try {

    // Authorization check: self or admin only
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const user = await User.findById(req.params.id).select('-password')
    if(!user || user.isDeleted){
     return res.status(404).json({message: "User not found"})
    }
    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
};


export const updateUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if email is being updated and already exists
    if (req.body.email && req.body.email !== user.email) {
      const existing = await User.findOne({ email: req.body.email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "User Updated successfully", data: updatedUser });
  } catch (error) {
    next(error);
  }
};


export const softDeleteUser = async (req, res, next) => {
  try{
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, {isDeleted: true}, {new: true})

     if(req.user.id !== req.params.id && req.user.role !== "admin"){
      res.status(403).json({message: "Unauthorized"})
    }
    if(!user) return res.status(404).json({message: "User not found"})
      res.status(200).json({message: "User soft-deleted successfully"})
    } catch(error){
      next(error)
    }
  
}

export const deleteUserById = async (req, res, next) => {
  try {
     const user = await User.findByIdAndDelete(req.params.id)
    if(req.user.id !== req.params.id && req.user.role !== "admin"){
      res.status(403).json({message: "Unauthorized"})
    }
    if (!user || user.isDeleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error)
  }
}
  