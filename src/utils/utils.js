const connection = require('../database/connection');

module.exports = {
    async validateAPIToken(apiToken) {
        const queryAPIToken = await connection('lds_dh_users')
        .select('api_token')
        .where({
            api_token: apiToken
        });

        if (queryAPIToken.length > 0) {
            return true;
        }
        return false;
    }
}