const { Users } = require('../models');
const bcrypt = require('bcrypt');

const getUserDetails = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findByPk(userId, {
      attributes: ['firstname', 'lastname', 'username', 'email', 'picturePath']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user details:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const { firstname, lastname, username, email } = req.body;

  try{
    const user = await Users.findByPk(userId);
    if(!user){
      res.status(404).json({message: 'user not found'});
    }

    const updatedUser = await user.update({
      firstname,
      lastname,
      username,
      email
    });

    return res.status(200).json({ message: 'User updated successfully', updatedUser });
  }catch (err){
    console.log(err);
    return res.status(500).json({message: err.message})
  }

}


const updateProfilePicture = async (req, res) => {
  const userId = req.params.userId;
  const picturePath = req.file ? `assets/profiles/${req.file.filename}` : null;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
     await user.update({
      picturePath: picturePath
    })

    return res.status(200).json({ message: 'Profile picture updated successfully', user});
  } catch (err) {
    console.log('Error updating profile picture:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword, newConfirmPassword } = req.body;

  try {
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.json({ message: 'Old password is incorrect' });
    }

    if(newPassword != newConfirmPassword){
      return res.json({ message: 'password and confirm password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { getUserDetails, updateUserDetails, updateProfilePicture , updatePassword};
