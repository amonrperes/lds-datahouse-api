const CryptoJS = require("crypto-js");
const crypto = require('crypto');

class Cryptography {
    encryptLCRCredentials(credentials) {
        const username = CryptoJS.SHA256(credentials.username);
        const password = CryptoJS.SHA256(credentials.password);
        
        return {username, password}
    }

    generateAPICredentials() {
        const apiSid = `sid_${crypto.randomBytes(5).toString('hex')}`;
        const apiToken = `token_${crypto.randomBytes(20).toString('hex')}`;

        return {apiSid, apiToken}
    }
}

module.exports = Cryptography;