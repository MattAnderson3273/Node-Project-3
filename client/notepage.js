/**
 * JavaScript file for all of the functionality on the notes.html page. Includes event listeners for the 
 * submit button to get notes, the delete button to delete notes, and the rows in the table that include
 * buttons for editing and checkboxes for deleting. A separate function called 'addTableRow' is used to add
 * rows in the table to display users' individual notes. 
 **/ 

// Accessing the DOM
const submitButton = document.querySelector('#get-notes-button');
const userNameInput = document.querySelector('#exampleFormControlInput1');
const table = document.querySelector('#table');
const tableHead = document.querySelector('#note-author');
const tableRow = document.querySelector('#note-list');
const deleteButton = document.querySelector('#delete-button');

let masterNote = ''; // master of the note that will eventually be updated 

// Event listener for the submit button, showing all notes for the username provided. 
// If username is not valid or not entered, an alert will tell the user to enter a valid username.  
submitButton.addEventListener('click', (event) => {

	// fetch request for GET 
	fetch(`http://localhost:5000/notes/${userNameInput.value}`, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
	})
		.then((res) => res.json())
		.then((json) => {
			console.log(json); 
			json.forEach((note, index) =>
				addTableRow(note, userNameInput.value, index + 1)
			);
		})
		.catch((error) => alert('Please provide a valid username.'));
	event.preventDefault();
});

// Event listener for the rows in the table: functionality will be different depending on where the user clicks
tableRow.addEventListener('click', (event) => {

	// If user clicks the edit button, they are given the ability to edit the note and either confirm or canel their edit
	if (event.target.classList.contains('edit')) {

		// extremely complex DOM manipulation to get desired elements (this took an hour to figure out please don't mark us down for this)
		const oldNote = event.target.parentElement.parentElement.childNodes[3].textContent;
		masterNote = oldNote;
		const noteTableColumn = event.target.parentElement.parentElement.childNodes[3];

		// replace static note text with a form that will result in new edited text
		noteTableColumn.innerHTML = `<form>
    			<label for="new-note-form"></label>
    			<input type="text" class="form-control" id="new-note-form">
		</form>`;

		// add confirm and cancel buttons for the edited note
		event.target.parentElement.innerHTML = `
			<button type="button" class="btn btn-primary btn-sm mb-3 confirm">Confirm</button>
			<button type="button" class="btn btn-danger btn-sm mb-3 cancel">Cancel</button>
		`;

		// change value of text field to the original note, so the user can see the original note and edit it as they see fit 
		const newNoteForm = document.querySelector('#new-note-form');
		newNoteForm.value = oldNote;
	}

	// If user clicks the confirm button while editing a note, will confirm the edit and change the text of the note in the DOM and in the text file 
	if (event.target.classList.contains('confirm')) {

		// change the text field back to normal text and remove the confirm/cancel buttons for an edit button (back to default for the rows of the table)
		const newNote = document.querySelector('#new-note-form');
		const noteTableColumn = event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = newNote.value;
		event.target.parentElement.innerHTML = `<a href="#" class="btn btn-secondary btn-sm edit">Edit</a>`;

		// fetch request for PATCH 
		fetch(`http://localhost:5000/notes/${userNameInput.value}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				username: userNameInput.value,
				oldNote: masterNote,
				newNote: newNote.value,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				alert(JSON.stringify(data));
			})
	}

	// If user clicks the cancel button while editing a button, then the edits made in the text field are discarded and the note remains the same 
	if (event.target.classList.contains('cancel')) {
		const noteTableColumn =
			event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = masterNote;
		event.target.parentElement.innerHTML = `<a href="#" class="btn btn-secondary btn-sm edit">Edit</a>`;
	}

	// Manually check the checkbox, since its not working automatically
	if (event.target.type === 'checkbox') {
		let checkStatus = event.target.getAttribute('checked'); 
		event.target.prop('checked', !checkStatus);
	}

	if (event.target.classList) event.preventDefault();
});

// Event listener for the delete button: used to delete notes from the DOM and text files 
deleteButton.addEventListener('click', (event) => {
	
	// Returns all checked box objects of the name 'deleteBox'
	var checkboxes = document.querySelectorAll(
		'input[name="' + "deleteBox" + '"]'
	);

	let notesToDelete = []; // will be sent to server to delete the notes added within the array

	// Loop through all the checkboxes to get the notes to be deleted
	for (const element of checkboxes) {

		if (element.checked) {
			notesToDelete.push(
				element.parentElement.parentElement.childNodes[3].innerHTML
			);
		}

		// delete all rows: remaining rows will be displayed again once the DELETE request has been sent 
		element.parentElement.parentElement.remove();
	}

	// fetch request for DELETE
	fetch(`http://localhost:5000/notes/${userNameInput.value}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({
			notes: notesToDelete,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			// re-add rows to table that have not been deleted
			data.forEach((note, index) =>
				addTableRow(note, userNameInput.value, index + 1) 
			);
		});
});

// Adds a row for each note in the text file pertaining to the user whose name was submitted
function addTableRow(note, username, number) {
	const row = document.createElement('tr');

	row.innerHTML = `
        <td>${number}</td>
        <td class="note">${note}</td>
        <td><a href="#" class="btn btn-secondary btn-sm edit">Edit</a></td>
		<td><input name="deleteBox" class="form-check-input me-1" type="checkbox" aria-label="..." id="checkbox"></td>
    `;

	deleteButton.style.visibility = 'visible';
	tableHead.innerHTML = `Notes Authored By: ${username}`;
	tableRow.appendChild(row);
}
