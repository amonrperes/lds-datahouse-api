const connection = require('../../database/connection');
const crypto = require('crypto');

class EldersQuorum {
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
              await connection('lds_dh_elders_quorum_birthdays').insert({
                id: crypto.randomBytes(10).toString('hex'),
                name: element.name,
                birthday: element.birthday,
                stake_id,
                stake_name,
                ward_id,
                ward_name,
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
          const birthdays = await connection('lds_dh_elders_quorum_birthdays')
            .select('id', 'name', 'birthday')
            .where({stake_id, ward_id});

          ret.status = 'OK';
          ret.data = birthdays;
        } catch (err) {
          console.log(err);
          ret.message = 'Something went wrong';
        }
    
        return ret;
    }
}

module.exports = EldersQuorum;
