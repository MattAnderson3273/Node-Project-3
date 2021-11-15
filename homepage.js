function start() {
    const submitButton = document.querySelector("#submitButton");
    const userNameInput = document.querySelector("#exampleFormControlInput1");
    const noteInput = document.querySelector("#exampleFormControlTextarea1");
    

    // let userNames = [];
    const userNames = new Map();

  

    submitButton.addEventListener("click", (event) => {

        // Solution to fetch JSON data found here: https://stackoverflow.com/questions/29775797/fetch-post-json-data
        fetch('http://localhost:5000/notes', {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ username: userNameInput.value, note: noteInput.value })
        })
            .then((res) => { return res.json(); })
            .then((data) => { alert(JSON.stringify(data)); });

        event.preventDefault();
    });
}

window.addEventListener("load", start);