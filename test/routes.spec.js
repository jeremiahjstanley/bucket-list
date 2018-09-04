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
					response.should.be.json;
					response.body.should.be.a('array');
					response.body.should.have.length(3);
					response.body[0].should.have.property('id');
					response.body[0].should.have.property('title');
					response.body[0].should.have.property('description');
					response.body[0].id.should.equal(1);
					response.body[0].title.should.equal('Travel the World');
					response.body[0].description.should.equal('Go all the places');
					done();
				})
			});

	});

	describe('POST api/v1/list_items', () => {

		it('Should create a new list item', (done) =>  {
			chai.request(server)
				.post('/api/v1/list_items')
				.send({"title": "Rob a bank", "description": "Just to see what it feels like"})
				.end((error, response) => {
					response.should.have.status(201);
					response.should.be.json;
					response.body.should.be.a('object');
					response.body.should.have.property('id');
					response.body.id.should.equal(4);
					done();
				})
			});

		it('Should not create a new list item is there are missing parameters', (done) =>  {
			chai.request(server)
				.post('/api/v1/list_items')
				.send({"title": "Dive the Maldives"})
				.end((error, response) => {
					response.should.have.status(422);
					response.should.be.json;
					response.body.error.should.equal('Expected format: {title: <STRING>, description: <TEXT> } You are missing a "description" property')
					done();
				})
			});
		
	});

	describe('DELETE api/v1/list_items', () => {

		it('Should delete list item', (done) =>  {
			chai.request(server)
				.delete('/api/v1/list_items/1')
				.end((error, response) => {
					response.should.have.status(204);
					response.should.be.string;
					done();
				})
			});

		it('Should return a 404 if a list item is not found', (done) =>  {
			chai.request(server)
				.delete('/api/v1/list_items/27')
				.end((error, response) => {
					response.should.have.status(404);
					response.should.be.json;
					response.body.error.should.equal('could not find list item with id: "27"')
					done();
				})
			});
		
	});

});