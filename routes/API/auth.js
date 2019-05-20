const express = require('express')
const router = express.Router()

//@route :    test route GET and endpoint is : api/user
//@desc :     test route
//@access :   public (private is with tokens)
router.get ('/', (req, res) => res.send('Auth route'))

module.exports = router
