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
      message: 'User not authorized to accesc Leaders and Clerks Resources'
    };

    const username = lcrCredentials.username;
    const password = lcrCredentials.password;

    const checkIfUserExists = await connection('lds_dh_users').
    select('lcr_username', 'lcr_password').
    where({
      lcr_username: username,
      lcr_password: password
    });

    if (checkIfUserExists.length > 0) {
      ret.message = 'User already exists';

      return ret;
    }

    const checkUserLCRPermission = await lcr.checkUserAuthenticity(username, password);
    
    if (checkUserLCRPermission.status !== 'OK') {
      return ret;
    }
    
    const {apiSid, apiToken} = cryptography.generateAPICredentials();

    try {
      await connection('lds_dh_users').insert({
        id: `user_${crypto.randomBytes(10).toString('hex')}`,
        name: userInfo.name,
        email: userInfo.email,
        lcr_username: username,
        lcr_password: password,
        api_sid: apiSid,
        api_token: apiToken
      });
    } catch(err) {
      ret.message = err;
      return ret;
    }

    ret.status = 'OK';
    ret.message = 'User authorized';
    ret.api_credentials = {
      api_sid: apiSid,
      api_token: apiToken
    }

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
  async retrieveUserLCRCredentials(apiSid, apiToken) {
    const ret = {
      status: 'ERROR'
    };

    let response;

    try {
      response = await connection('lds_dh_users').
      select('lcr_username', 'lcr_password').
      where({
        api_sid: apiSid,
        api_token: apiToken 
      });
    } catch(err) {
      ret.message = 'Could fetch database';
      ret.error_details = err;
      return ret;
    }

    ret.status = 'OK';
    ret.credentials = response[0];

    return ret;
  }
}

module.exports = Auth;
