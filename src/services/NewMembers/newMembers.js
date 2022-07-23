const connection = require('../../database/connection');
const crypto = require('crypto');

class NewMembers {
  async create(payload) {
    const ret = {
      status: 'ERROR',
    };

    payload.forEach(async (element) => {
      try {
        await connection('lds_dh_new_members').insert({
          id: crypto.randomBytes(10).toString('hex'),
          name: element.name,
          age: element.age,
          gender: element.gender,
          responsibility: element.responsibility || 'null',
        }).onConflict('name').merge();
      } catch (err) {
        console.log(err);
      }
    });

    ret.status = 'OK';
    ret.message = 'Successfully updated';

    return ret;
  }

  async retrieve() {
    const ret = {
      status: 'ERROR',
    };

    try {
      const newMembers = await connection('lds_dh_new_members').select('*');

      ret.status = 'OK';
      ret.data = newMembers;
    } catch (err) {
      ret.message = 'Something went wrong';
    }

    return ret;
  }
}

module.exports = NewMembers;
