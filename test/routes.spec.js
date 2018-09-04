process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex.js');

chai.use(chaiHttp);

describe('Client Routes', () => {

	it('Should return the homepage', (done) => {
		chai.request(server)
		.get('/')
			.end((error, response) => {
				response.should.have.status(200);
				response.should.be.html;
				done();
		});
	});

	it('Should return a 404 for a page that does not exist', (done) => {
		chai.request(server)
			.get('/nothing-to-see-here')
			.end((error, response) => {
				response.should.have.status(404);
				done();
		});
	});

});

describe('API Endpoints', () => {

	beforeEach(done => {
		knex.migrate.rollback()
			.then(() => knex.migrate.latest())
			.then(() => knex.seed.run())
			.then(() => done())
	});

	describe('GET api/v1/list_items', () => {

		it('Should return all of the list items', (done) =>  {
			chai.request(server)
				.get('/api/v1/list_items')
				.end((error, response) => {
					response.should.have.status(200);
					done();
				})
			});

	});

});