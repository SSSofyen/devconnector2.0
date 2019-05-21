const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const config = require('config');

const {
  check,
  validationResult
} = require('express-validator/check')

const User = require('../../models/User');


//@route :    test route GET and endpoint is : api/user
//@desc :     register User
//@access :   public (private is with tokens)
router.post('/',
  [
    // name must not be empty
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    // password must be at least 5 chars long
    check('password', 'please enter a password with at least 6 characters').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    //400 points to the error being a bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      password
    } = req.body

    try {
      //see if user exists
      let user = await User.findOne({
        email
      })

      if (user) {
      return res.status(400).json({
          errors: [{
            msg: 'User already exists'
          }]
        })
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      })

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      // write return json webtoken code

      res.send('User registered')

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  })

module.exports = router
