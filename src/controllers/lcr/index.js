const LCR = require('../../services/LCR/lcr');

const lcr = new LCR();

module.exports = {
    async syncData(req, res) {
        const {username, password} = req.body;

        const response = await lcr.syncData(username, password);

        return res.status(201).json(response);
    }
}