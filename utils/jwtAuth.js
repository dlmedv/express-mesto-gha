const jwt = require('jsonwebtoken');

const signToken = (payload) => jwt.sign(payload, 'super-secret', { expiresIn: '7d' });

module.exports = {
  signToken,
};
