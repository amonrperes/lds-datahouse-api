const Auth = require('../../services/Auth/auth');

const auth = new Auth();

module.exports = {
  async registerUser(req, res) {
    const { name, email, username, password } = req.body;

    try {
        const authorize = await auth.register({name, email}, {username, password});

        if (authorize.status !== 'OK') {
            return res.status(403).json(authorize);
        }
    
        return res.status(201).json(authorize);
    } catch(err) {
        return res.status(500).json({
            status: 'ERROR',
            message: `Unknow Error - ${err}`
        })
    }
  },
  async retrieveUsersList(req, res) {
    try {
      const users = await auth.listUsers();

      if (users.status === 'OK') {
        return res.status(201).json(users);
      } else {
        return res.status(500).json({
          error: 'something went wrong',
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};
