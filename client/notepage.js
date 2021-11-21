const notesButton = document.querySelector("#get-notes-button");
const userNameInput = document.querySelector("#exampleFormControlInput1");
const table = document.querySelector("#table");
const tableHead = document.querySelector("#note-author");
const tableDataToAdd = document.querySelector("#note-list");
const deleteButton = document.querySelector("#delete-button");

let masterNote = "";

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
			console.log(json); 
			json.forEach((note, index) =>
				addTableRow(note, userNameInput.value, index + 1)
			);
		})
		.catch((error) => alert('Please provide a username.'));
	event.preventDefault();
});

// Add event listener from the body of
// some html as it has rows dynamically added to it
tableDataToAdd.addEventListener("click", (event) => {
	if (event.target.classList.contains("edit")) {
		const oldNote =
			event.target.parentElement.parentElement.childNodes[3].textContent;
		masterNote = oldNote;
		const noteTableColumn =
			event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = `<form>
    			<label for="new-note-form"></label>
    			<input type="text" class="form-control" id="new-note-form">
		</form>`;

		event.target.parentElement.innerHTML = `
			<button type="button" class="btn btn-primary btn-sm mb-3 confirm">Confirm</button>
			<button type="button" class="btn btn-danger btn-sm mb-3 cancel">Cancel</button>
		`;
		const newNoteForm = document.querySelector("#new-note-form");
		newNoteForm.value = oldNote;
	}

	if (event.target.classList.contains("confirm")) {
		const newNote = document.querySelector("#new-note-form");
		const noteTableColumn =
			event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = newNote.value;
		event.target.parentElement.innerHTML = `<a href="#" class="btn btn-secondary btn-sm edit">Edit</a>`;

		fetch(`http://localhost:5000/notes/${userNameInput.value}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
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

	if (event.target.classList.contains("cancel")) {
		const noteTableColumn =
			event.target.parentElement.parentElement.childNodes[3];
		noteTableColumn.innerHTML = masterNote;
		event.target.parentElement.innerHTML = `<a href="#" class="btn btn-secondary btn-sm edit">Edit</a>`;
	}

	// Manually check the checkbox, since its not working automatically
	if (event.target.type === "checkbox") {
		let checkStatus = event.target.getAttribute("checked"); 
		event.target.prop("checked", !checkStatus);
	}

	if (event.target.classList) event.preventDefault();
});

deleteButton.addEventListener("click", (event) => {
	
	// Returns all checked box objects of the name "deleteBox"
	var checkboxes = document.querySelectorAll(
		'input[name="' + "deleteBox" + '"]'
	);

	let notesToDelete = [];

	// Loop through all the checkboxes to get the note text within an aunt/uncle element
	for (const element of checkboxes) {

		if (element.checked) {
			notesToDelete.push(
				element.parentElement.parentElement.childNodes[3].innerHTML
			);
		}
		//console.log(element.parentElement.parentElement.childNodes[3].innerHTML);
		element.parentElement.parentElement.remove(); 
	}

	fetch(`http://localhost:5000/notes/${userNameInput.value}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify({
			notes: notesToDelete,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			data.forEach((note, index) =>
				addTableRow(note, userNameInput.value, index + 1)
			);
		});
});

function addTableRow(note, username, number) {
	const row = document.createElement("tr");

	row.innerHTML = `
        <td>${number}</td>
        <td class="note">${note}</td>
        <td><a href="#" class="btn btn-secondary btn-sm edit">Edit</a></td>
		<td><input name="deleteBox" class="form-check-input me-1" type="checkbox" aria-label="..." id="checkbox"></td>
    `;

	deleteButton.style.visibility = "visible";
	tableHead.innerHTML = `Notes Authored By: ${username}`;
	tableDataToAdd.appendChild(row);
}
