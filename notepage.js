const notesButton = document.querySelector("#get-notes-button");
const userNameInput = document.querySelector("#exampleFormControlInput1");
const table = document.querySelector("#table");
const tableHead = document.querySelector("#note-author");
const tableDataToAdd = document.querySelector("#note-list");

// Remove me later after creating EDIT HTML Structures
let userName1 = "Mary";
let oldNote1 = "WAAAAAAAAA!";
let newNote1 = "WAAAAAAAAAS";

fetch(`http://localhost:5000/notes/${userName1}`, {
	method: "PATCH",
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Credentials": true,
	},
	body: JSON.stringify({
		username: userName1,
		oldNote: oldNote1,
		newNote: newNote1,
	}),
})
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		alert(JSON.stringify(data));
	});
// Remove me later end

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

function addTableRow(note, username, number) {
	const row = document.createElement("tr");
	row.innerHTML = `
        <td>${number}</td>
        <td>${note}</td>
        <td><a href="#" class="btn btn-secondary btn-sm">Edit</a> <a href="#" class="btn btn-danger btn-sm">Delete</a></td>
    `;

	tableHead.innerHTML = `Notes Authored By: ${username}`;
	tableDataToAdd.appendChild(row);
}

tableDataToAdd.addEventListener("click", (event) => {
	console.log(event.target);
});
