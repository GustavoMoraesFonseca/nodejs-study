export async function up(knex) {
  await knex.schema.createTable(
    'tab_pokemon_type', (table) => createPokemonTypeTable(knex, table)
  );
  await knex.schema.createTable(
    'tab_pokemon', (table) => createPokemonTable(knex, table)
  );
  await knex('tab_pokemon_type').insert(getPokemonTypes());
}

export async function down(knex) {
  await knex.schema.dropTable('knex_migrations');
  await knex.schema.dropTable('knex_migrations_lock');
}

function createPokemonTable(knex, table) {
  table.increments('id').primary();
  table.string('name').unique().notNullable();
  table.integer('dex_number').unique().notNullable();
  table.integer('main_type_id').unsigned().notNullable();
  table.integer('second_type_id').unsigned();
  table.timestamp('dthr_create').defaultTo(knex.fn.now());
  table.timestamp('dthr_update').defaultTo(knex.fn.now());
  table.foreign('main_type_id').references('id').inTable('tab_pokemon_type');
  table.foreign('second_type_id').references('id').inTable('tab_pokemon_type');
}

function createPokemonTypeTable(knex, table) {
  table.increments('id').primary();
  table.string('name').unique().notNullable();
  table.timestamp('dthr_create').defaultTo(knex.fn.now());
  table.timestamp('dthr_update').defaultTo(knex.fn.now());
}

function getPokemonTypes() {
  const pokemonTypeNames = ['Fire', 'Water', 'Grass', 'Poison', 'Ground', 'Fairy', 'Fighting', 'Flying', 'Rock', 'Bug', 'Psychic', 'Dark', 'Normal', 'Steel', 'Ghost', 'Ice', 'Dragon', 'Electric'];
  const pokemonTypes = [];

  pokemonTypeNames.forEach(name =>
    pokemonTypes.push(
      {name: name, dthr_create: new Date(), dthr_update: new Date()}
    )
  )
  return pokemonTypes;
}