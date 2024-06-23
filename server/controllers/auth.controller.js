// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const register = async (req, res) => {
    try {
      const { 
        firstname,
        lastname,
        username,
        email,
        password,
        confirmPassword,
      } = req.body;
  
      const picturePath = req.file ? `assets/profiles/${req.file.filename}` : null;
  
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Password and confirm password do not match' });
      }
  
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use. Please use a different email.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await Users.create({
        firstname,
        lastname,
        username,
        email,
        picturePath, 
        password: hashedPassword,
      });
  
      return res.status(201).json({ message: 'User registered successfully' });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred during registration: ' + err.message });
    }
  };
  

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'User doesn\'t exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Email & Password are incorrect' });
        }

        const accessToken = jwt.sign(
            { userId: user.userId },
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.userId },
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: '7d' } 
        );
      
        
        res.cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000, 
            sameSite: 'strict',

        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true,
            sameSite: 'strict',
        
        });
        
        const sanitizedUser = {
            id: user.userId,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            picturePath: user.picturePath,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        
        return res.status(200).json({ accessToken, refreshToken, sanitizedUser });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getUserInfo = async (req, res) => {
  try{
    const user = await Users.findOne({ where: { userId: req.userId }});
    if(!user){
      return res.status(400).json({message: 'User not found'});
    }

    const sanitizedUser = {
            id: user.userId,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            picturePath: user.picturePath,
    };
    return res.status(200).json({sanitizedUser});
  }catch(err){
      res.status(500).json({ error: err});
  }
}

const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  res.status(200).json({ message: 'Logout Successfully' });
}


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      to: email,
      from: process.env.AUTH_EMAIL,
      subject: 'Password Reset',
      text: `Click the link to reset the password:\n\n
      http://localhost:5173/reset/${token}\n\n\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending email', error: err.message });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await Users.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};








module.exports = { register, login, logout, getUserInfo, sendPasswordResetEmail, resetPassword };


