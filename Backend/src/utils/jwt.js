const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Example usage:
// const token = generateToken(user);
// console.log(token);