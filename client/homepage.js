function start() {
	const submitButton = document.querySelector("#submitButton");
	const userNameInput = document.querySelector("#exampleFormControlInput1");
	const noteInput = document.querySelector("#exampleFormControlInput2");

	submitButton.addEventListener("click", (event) => {
		//event.preventDefault();
		fetch("http://localhost:5000/notes", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
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
				alert(JSON.stringify(data)); // may need fixing 
			});

		noteInput.value = "";
		event.preventDefault();
	});
}

window.addEventListener("load", start);
