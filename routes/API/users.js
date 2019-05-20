const express = require('express')
const router = express.Router()
const {
  check,
  validationResult
} = require('express-validator/check')

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
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    //400 points to the error being a bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    console.log(req.body)
    res.send('Users route')
  })

module.exports = router
