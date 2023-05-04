exports.up = function (knex) {
  return knex.schema.createTable('lds_dh_new_members', function (table) {
    table.string('id').notNullable();
    table.string('stake_id').notNullable();
    table.string('stake_name').notNullable();
    table.string('ward_id').notNullable();
    table.string('ward_name').notNullable();
    table.string('name').primary();
    table.string('age').notNullable();
    table.string('gender').notNullable();
    table.string('responsibility').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('lds_dh_new_members');
};
