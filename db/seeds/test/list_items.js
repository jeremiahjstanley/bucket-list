
exports.seed = (knex, Promise) => {
  return knex('list_items').del()
    .then(() => {
      return knex('list_items').insert([
        {id: 1, title: 'Travel the World', description: 'Go all the places'},
        {id: 2, title: 'Skydive', description: 'Jump out of an airplane'},
        {id: 3, title: 'Build a full-stack IdeaBox', description: 'Probably would have been a good mod4 final'},
      ]);
    })
    .then(() => console.log('Seeding complete'))
    .catch(() => console.log(`Error seeding data: ${error}`))
};