/**
 * JavaScript file for all of the functionality on the index.html page. Includes an event listener for the submit button, which adds a note
 * to an existing person's page or creates a new person based on the name the user supplies in the form. 
 */

// Accessing the DOM
const submitButton = document.querySelector('#submitButton');
const userNameInput = document.querySelector('#exampleFormControlInput1');
const noteInput = document.querySelector('#exampleFormControlInput2');

// Event listener for the submit button: adds a note for a username and adds that username if they don't already exist 
submitButton.addEventListener('click', (event) => {
	fetch('http://localhost:5000/notes', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({
			username: userNameInput.value,
			note: noteInput.value,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			alert(JSON.stringify(data));
		});

	noteInput.value = '';
	event.preventDefault();
});

