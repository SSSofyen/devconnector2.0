const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = function(req, res, next) {
  //get token from header: in protected routes, we are required to use a token,
  //there is a header property which contains our token, we call that with req.header
  //i take the token from header
  const token = req.header('x-auth-token')

  //checking if no token. error 401 is "not authorized"
  if(!token) {
    return res.status(401).json({ msg: 'no token, authorization DENIED'})
  }
  try {
    //i decode the token. verify method takes 2 props, a token and the secret
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    //i put the user.id from the db in payload earlier in users route
    //now i put the decoded token's user element in the req json
    req.user = decoded.user
    next()
  } catch(err) {
    res.status(401).json({msg: 'token not valid'})
  }
}
