const LCR = require('../../services/LCR/lcr');
const NewMembers = require('../../services/NewMembers/newMembers');

const utils = require('../../utils/utils');

const lcr = new LCR();
const nm = new NewMembers();

module.exports = {
  async syncData(req, res) {
    const {lcr_username: lcrUsername, lcr_password: lcrPassword} = req.body;
    const { apitoken } = req.headers;

    if (!apitoken) {
      return res.status(401).json({
        status: 'Not Authorized',
        message: 'Please, provide your API token in order to sync data. If you do not have an api token, please register on /register'
      });
    }

    if (!lcrUsername || !lcrPassword) {
      return res.status(401).json({
        status: 'Not Authorized',
        message: 'Please, provide your LCR credentials in order to sync data.'
      });
    }

    const isAPITokenValid = await utils.validateAPIToken(apitoken);

    if (!isAPITokenValid) {
      return res.status(400).json({
        message: 'Invalid API Token'
      })
    }

    const lcrResponse = await lcr.syncData(lcrUsername, lcrPassword);

    const updateNewMembersList = await nm.create(lcrResponse.newMembers);

    if (updateNewMembersList.status !== 'OK') {
      return res.status(500).json({
        status: updateNewMembersList.status,
        message: updateNewMembersList.message,
      });
    } else {
      return res.status(201).json(updateNewMembersList);
    }
  },

  async retrieveNewMembersList(req, res) {
    const { apitoken } = req.headers;

    if (!apitoken) {
      return res.status(401).json({
        status: 'Not Authorized',
        message: 'Please, provide your API token in order to sync data. If you do not have an api token, please register on /register'
      });
    }

    const isAPITokenValid = await utils.validateAPIToken(apitoken);

    if (!isAPITokenValid) {
      return res.status(400).json({
        message: 'Invalid API Token'
      })
    }

    try {
      const newMembersList = await nm.retrieve();

      if (newMembersList.status === 'OK') {
        return res.status(201).json(newMembersList);
      } else {
        return res.status(500).json({
          error: 'Something went wrong',
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
