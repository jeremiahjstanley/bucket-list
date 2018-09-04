$(window).ready(getListItems)
$('.form').on('submit', createListItem);
$('.list-items').on('click', '.delete-button', deleteListItem)

async function getListItems() {
	const url = 'api/v1/list_items';
	const response = await fetch(url);
	const listItems = await response.json();
	listItems.forEach(listItem => appendListItemToPage(listItem));
}

function createListItem(event) {
	event.preventDefault();
	const title = event.target[0].value;
	const description = event.target[0].value;
	if (title.length && description.length) {
		sendListItemToDB({title, description});
		$('.title').val('');
		$('.description').val('');
	} else {
		$('.feedback-text').text('Please enter a title and description');
	};
};

async function sendListItemToDB(listItem) {
	const url = '/api/v1/list_items'
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(listItem)
	});
	const id = await response.json()
	appendListItemToPage({...listItem, ...id})
};

function appendListItemToPage(listItem) {
	$('.list-items').append(`
			<li id='${listItem.id}'>
				<button class='delete-button'>X</button>
				<h3>${listItem.title}</h3>
				<p>${listItem.description}</p>
			</li>
		`);
};

async function deleteListItem() {
	const id = $(this).closest('li').attr('id');
	const url = `/api/v1/list_items/${id}`;
	const response = await fetch(url, {
		method: 'DELETE',
	});
	$(this).closest('li').remove();
}