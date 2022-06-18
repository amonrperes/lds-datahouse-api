const LCR = require('../../services/LCR/lcr');
const NewMembers = require('../../services/NewMembers/newMembers');

const lcr = new LCR();
const nm = new NewMembers();

module.exports = {
  async syncData(req, res) {
    const { username, password } = req.body;

    const lcrResponse = await lcr.syncData(username, password);

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
