const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'tubarao89',
        database: 'codolog',
    }
});

module.exports = {
    knex
};