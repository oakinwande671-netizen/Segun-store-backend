const express = require('express');
const router = express.Router();

const User = require('../models/userSchema');
 
 router.get('/hello', (req, res) => res.status(200).send("You are at the users route"))
router.post('/login', async (req, res) => {
    const userReq = req.body;

    if (!userReq) return res.status(400).send("Bad request. Username and password required");

    try {
        const user = await User.findOne({ username: userReq.username }).select('+password');

        if (!user) return res.status(404).send("User not found");

        if (user.password !== userReq.password) {
          return res.status(401).send('Invalid credentials')
        }

        const plainUser = user.toObject();
        delete plainUser.password;

        res.status(200).json(plainUser); 
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
})

router.post('/adduser', async (req, res) => {
    const newUser = req.body;

    if (!newUser)
      return res
        .status(400)
        .send("Bad request. Username and password required");
    
    try {
      const user = await User.create(newUser);
      const u0 = user.toObject();
      delete u0.password;
      res.status(201).send(u0);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({ userType: 'user' });
    
    if (!users) {
      return res.status(404).send("No users found");
    }

    res.status(200).json(users);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

router.post('/modify-pwd', async (req, res) => {
  const { oldPassword, newPassword, username } = req.body;

  try {
    const user = await User.findOne({ username: username }).select('password');
    
    if (!user) {
      return res.status(404).send("No users found");
    }

    if (!oldPassword === user.password) {
      return res.status(401).send("credentials did not match")
    }

    user.password = newPassword;
    await user.save();
    res.status(204).send();
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal server error");
  }
});

// remove a user
router.delete('/:username', async (req, res) => {
  try {
    await User.findOneAndDelete({ username: req.params.username })
    return res.status(204).json()
  } catch (error) {
    res.status(500).send("Internal server error");
  }
})

module.exports = router;