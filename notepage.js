const notesButton = document.querySelector("#get-notes-button");
const userNameInput = document.querySelector("#exampleFormControlInput1");
const table = document.querySelector("#table");
const tableHead = document.querySelector("#note-author");
const tableDataToAdd = document.querySelector("#note-list");
const deleteButton = document.querySelector('#delete-button');

let masterNote = ''; 

notesButton.addEventListener("click", (event) => {
	try {
		if (table.rows.length > 1) {
			for (let i = document.querySelector("#table").rows.length; i > 1; i--) {
				table.deleteRow(i - 1);
			}
		}
	} catch (error) {
		console.error(error.message);
	}

	fetch(`http://localhost:5000/notes/${userNameInput.value}`, {
		method: "GET",
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
	})
		.then((res) => res.json())
		.then((json) => {
			json.forEach((note, index) =>
				addTableRow(note, userNameInput.value, index + 1)
			);
		})
		.catch((error) => console.error(error.message));
	event.preventDefault();
});

tableDataToAdd.addEventListener("click", (event) => {

	if (event.target.classList.contains('edit')) {
 
		const oldNote = event.target.parentElement.parentElement.childNodes[3].textContent;
		masterNote = oldNote; 
		const noteTableColumn = event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = `<form>
    			<label for="new-note-form"></label>
    			<input type="text" class="form-control" id="new-note-form">
		</form>`;

		event.target.parentElement.innerHTML = `
			<button type="button" class="btn btn-primary btn-sm mb-3 confirm">Confirm</button>
			<button type="button" class="btn btn-danger btn-sm mb-3 cancel">Cancel</button>
		`;
		const newNoteForm = document.querySelector('#new-note-form');
		newNoteForm.value = oldNote;
	}  
	
	if (event.target.classList.contains('confirm')) {
		const newNote = document.querySelector('#new-note-form');
		const noteTableColumn = event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = newNote.value;
		event.target.parentElement.innerHTML = `<a href="#" class="btn btn-secondary btn-sm edit">Edit</a>`;

		fetch(`http://localhost:5000/notes/${userNameInput.value}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				'Accept': 'application/json',
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
			body: JSON.stringify({
				username: userNameInput.value,
				oldNote: masterNote,
				newNote: newNote.value
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				alert(JSON.stringify(data));
			});
	}
	
	if (event.target.classList.contains('cancel')) {
		const noteTableColumn = event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = masterNote; 
		event.target.parentElement.innerHTML = `<a href="#" class="btn btn-secondary btn-sm edit">Edit</a>`; 

	}
});

function addTableRow(note, username, number) {
	const row = document.createElement("tr");

	row.innerHTML = `
        <td>${number}</td>
        <td class="note">${note}</td>
        <td><a href="#" class="btn btn-secondary btn-sm edit">Edit</a></td>
		<td><input class="form-check-input me-1" type="checkbox" aria-label="..." id="checkbox"></td>
    `;

	deleteButton.style.visibility = 'visible';
	tableHead.innerHTML = `Notes Authored By: ${username}`;
	tableDataToAdd.appendChild(row);
}

