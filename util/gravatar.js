/*
    Takes in an email and generate a Gravatar url
    Refer: https://en.gravatar.com/site/implement/profiles/jsapi/
           https://en.gravatar.com/site/implement/images/
*/

// To hash email
const md5 = require('md5');

// Hashes email and returns image url acc to the hash from gravatar
const gravatar = email => {
    const hash = md5(email);
    return `https://www.gravatar.com/avatar/${hash}.jpg?d=identicon`;
}

module.exports = gravatar;