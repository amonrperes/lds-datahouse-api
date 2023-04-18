exports.up = function (knex) {
    return knex.schema.createTable('lds_dh_users', function (table) {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('api_token').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('lds_dh_users');
  };
  