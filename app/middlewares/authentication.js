const jwt = require('jsonwebtoken');

module.exports = {
  validateToken: (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers.authorization;

    // decode token
    if (!token) return res.status(401).send('You are not authorized.');

    token = token.replace('Bearer ', '');

    // verifies secret and checks exp
    jwt.verify(token, Config.variables.secret, (err, decoded) => {
      if (err) return res.status(401).send('You are not logged in.');

      console.log(decoded);
      User.findById(decoded._id)
        .exec()
        .then(user => {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        })
        .catch(err => {
          console.log(err);
          return res.status(500).send('We are having a system issue, our engineers are on it');
        });

    });
  }
  
};