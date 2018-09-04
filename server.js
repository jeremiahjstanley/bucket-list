const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.title = 'Bucket List';

app.get('/'), (request, response) => {
	response.send(`${app.locals.title} has been successfully compiled`);
};

app.get('/api/v1/list_items', (request, response) => {
	database('list_items').select()
		.then(listItems => {
			return response.status(200).json(listItems);
		})
		.catch(error => {
			return response.stauts(500).send({ error });
		});
});

app.get('/api/v1/list_items/:id', (request, response) => {
	const { id } = request.params;

	database('list_items').where('id', id).select()
		.then(listItems => {
			if (listItems.length) {
				return response.status(200).json(listItems);
			} else {
				return response.status(404).json({error: `could not find list item with id: "${id}"`});
			};
		})
		.catch(error => {
			return response.status(500).json({ error });
		});
});

app.post('/api/v1/list_items', (request, response) => {
	const listItem = request.body

	for(let requiredParam of ['title', 'description']) {
		if (!listItem[requiredParam]) {
			return response.status(422).json({error: `Expected format: {title: <STRING>, description: <TEXT> } You are missing a "${requiredParam}" property`});
		};
	};

	database('list_items').insert(listItem, 'id')
		.then(listItems => {
			return response.status(201).json({id: listItems[0]});
		})
		.catch(error => {
			return response.status(500).json({ error });
		})
});

app.delete('/api/v1/list_items/:id', (request, response) => {
	const { id } = request.params;

	database('list_items').where('id', id).select()
		.then(listItems => {
			if (listItems.length) {
				database('list_items').where('id', id).del()
					.then(listItems => {
						return response.status(204).send(`Record: "${id}" successfully deleted`)
					})
					.catch(error => {
						return response.status(500).json({ error })
					})
			} else {
					return response.status(404).json({error: `could not find list item with id: "${id}"`});
			};
		})
		.catch(error => {
			return response.status(500).json({ error })
		})
});

app.listen(app.get('port'), () => {
	console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;