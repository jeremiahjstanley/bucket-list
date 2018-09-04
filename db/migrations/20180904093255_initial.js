
exports.up = function(knex, Promise) {
  return knex.schema.createTable('list_items', (table) => {
  	table.increments('id').primary;
  	table.string('title');
  	table.text('description');

  	table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('list_items');
};
