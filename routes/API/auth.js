const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config');
const {
  check,
  validationResult
} = require('express-validator/check')


const User = require ('../../models/User')

//@route :    test route GET and endpoint is : api/auth
//@desc :     test route
//@access :   public (private is with tokens)

//adding auth through the import and adding the param in theroute maks it protected
//thus it has a header with a field expecting a token
router.get ('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch(err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

router.post('/',
  [
    // name must not be empty
    check('email', 'Please include a valid email').isEmail(),
    // password must be at least 5 chars long
    check('password', 'password is required').exists()
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
      email,
      password
    } = req.body

    try {
      //see if user exists
      let user = await User.findOne({
        email
      })

      if (!user) {
        return res.status(400).json({
          errors: [{
            msg: 'invalid credentials'
          }]
        })
      }

      //in compare method the first parameter is a plain password and the second is a cryptd password (as is in our DB)
      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) {
          return res.status(400).json({
            errors: [{
              msg: 'invalid credentials'
            }]
          })
      }

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err
          res.json({
            token
          })
        }
      )

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  })


module.exports = router
