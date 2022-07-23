const LCR = require('../../services/LCR/lcr');
const NewMembers = require('../../services/NewMembers/newMembers');
const Auth = require('../../services/Auth/auth');

const lcr = new LCR();
const nm = new NewMembers();
const auth = new Auth();

module.exports = {
  async syncData(req, res) {
    const { bearer } = req.headers;

    const apiSid = bearer.split(':')[0];
    const apiToken = bearer.split(':')[1];

    const lcrCredentials = await auth.retrieveUserLCRCredentials(apiSid, apiToken);

    const lcrResponse = await lcr.syncData(lcrCredentials.credentials.lcr_username, lcrCredentials.credentials.lcr_password);

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
    try {
      const newMembersList = await nm.retrieve();

      if (newMembersList.status === 'OK') {
        return res.status(201).json(newMembersList);
      } else {
        return res.status(500).json({
          error: 'something went wrong',
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
