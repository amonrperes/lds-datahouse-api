exports.up = function (knex) {
    return knex.schema.createTable('lds_dh_elders_quorum_birthdays', function (table) {
      table.string('id').notNullable();
      table.string('name').primary();
      table.string('birthday').notNullable();
      table.string('stake_id').notNullable();
      table.string('stake_name').notNullable();
      table.string('ward_id').notNullable();
      table.string('ward_name').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('lds_dh_elders_quorum_birthdays');
  };