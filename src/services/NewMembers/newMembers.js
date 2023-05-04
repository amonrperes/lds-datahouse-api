const connection = require('../../database/connection');
const crypto = require('crypto');

class NewMembers {
  async create(payload, apiToken) {
    const ret = {
      status: 'ERROR',
    };
    const queryUserUnityInfo = await connection('lds_dh_users')
      .select('stake_id', 'stake_name', 'ward_id', 'ward_name')
      .where({ api_token: apiToken });

    const { stake_id, stake_name, ward_id, ward_name } = queryUserUnityInfo[0];

    payload.forEach(async (element) => {
      try {
        await connection('lds_dh_new_members').insert({
          id: crypto.randomBytes(10).toString('hex'),
          stake_id,
          stake_name,
          ward_id,
          ward_name,
          name: element.name,
          age: element.age,
          gender: element.gender,
          responsibility: element.responsibility || 'No resposibility assigned',
        }).onConflict('name').merge();
      } catch (err) {
        console.log(err);
      }
    });

    ret.status = 'OK';
    ret.message = 'Successfully updated';

    return ret;
  }

  async retrieve(apiToken) {
    const ret = {
      status: 'ERROR',
    };

    const queryUserUnityInfo = await connection('lds_dh_users')
      .select('stake_id', 'ward_id',)
      .where({ api_token: apiToken });

    const { stake_id, ward_id } = queryUserUnityInfo[0];

    try {
      const newMembers = await connection('lds_dh_new_members')
        .select('id', 'name', 'age', 'gender', 'responsibility')
        .where({stake_id, ward_id});

      ret.status = 'OK';
      ret.data = newMembers;
    } catch (err) {
      ret.message = 'Something went wrong';
    }

    return ret;
  }
}

module.exports = NewMembers;
