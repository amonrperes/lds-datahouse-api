const CryptoJS = require("crypto-js");
const crypto = require('crypto');

class Cryptography {
    encryptLCRCredentials(credentials) {
        const username = CryptoJS.SHA256(credentials.username);
        const password = CryptoJS.SHA256(credentials.password);
        
        return {username, password}
    }

    generateAPIToken() {
        return `token_${crypto.randomBytes(20).toString('hex')}`;
    }
}

module.exports = Cryptography;