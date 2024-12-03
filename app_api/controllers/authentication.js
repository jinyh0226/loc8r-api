const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  try {
    console.log('Saving user:', user); // 저장 전 로그
    await user.save();
    console.log('User saved successfully'); // 저장 성공 로그
    const token = user.generateJwt();
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Error saving user:', err); // 에러 로그
    return res.status(404).json(err);
  }
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const { user, info } = await new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) return reject(err);
        resolve({ user, info });
      })(req, res);
    });

    if (user) {
      const token = user.generateJwt();
      return res.status(200).json({ token });
    } else {
      return res.status(401).json(info);
    }
  } catch (err) {
    return res.status(404).json(err);
  }
};

module.exports = {
  register,
  login,
};