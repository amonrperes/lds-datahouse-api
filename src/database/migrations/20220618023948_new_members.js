exports.up = function (knex) {
  return knex.schema.createTable('lds_dh_new_members', function (table) {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('age').notNullable();
    table.string('gender').notNullable();
    table.string('responsibility').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('lds_dh_new_members');
};
