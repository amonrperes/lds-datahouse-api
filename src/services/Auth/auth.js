const connection = require('../../database/connection');
const crypto = require('crypto');

const LCR = require('../LCR/lcr');
const Cryptography = require('../../utils/cryptography');
// const EmailSender = require('../../utils/emailSender');

const lcr = new LCR();
const cryptography = new Cryptography();

class Auth {
  async register(userInfo, lcrCredentials) {
    const ret = {
      status: 'ERROR',
      message: 'User not authorized to access Leaders and Clerks Resources'
    };

    const checkIfUserExists = await connection('lds_dh_users').
    select('name', 'email').
    where({
      name: userInfo.name,
      email: userInfo.email
    });

    if (checkIfUserExists.length > 0) {
      ret.message = 'User already exists';

      return ret;
    }

    const checkUserLCRPermission = await lcr.checkUserAuthenticity(lcrCredentials.username, lcrCredentials.password);
    
    if (checkUserLCRPermission.status !== 'OK') {
      return ret;
    }
    
    const apiToken = cryptography.generateAPIToken();

    try {
      await connection('lds_dh_users').insert({
        id: `user_${crypto.randomBytes(10).toString('hex')}`,
        name: userInfo.name,
        email: userInfo.email,
        api_token: apiToken
      });
    } catch(err) {
      ret.message = err;
      return ret;
    }

    ret.status = 'OK';
    ret.message = 'User authorized';
    ret.api_credentials = {
      api_token: apiToken
    }
    ret.privacy_note = 'We do not store any of your LCR credentials or sensitive personal information. LCR credentials are only used to check an user permission to use LCR and to sync data pertinent to an user calling.';

    return ret;
  }

  async listUsers() {
    const ret = {
      status: 'ERROR',
    };

    try {
      const users = await connection('lds_dh_users').select('*');

      ret.status = 'OK';
      ret.data = users;
    } catch (err) {
      ret.message = 'Something went wrong';
    }

    return ret;
  }
}

module.exports = Auth;
