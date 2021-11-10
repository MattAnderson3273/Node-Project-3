function start() {
    const submitButton = document.querySelector("#submitButton");
    const userNameInput = document.querySelector("#exampleFormControlInput1");
    const noteInput = document.querySelector("#exampleFormControlTextarea1");

    // let userNames = [];
    const userNames = new Map();


    // Open all of the text files for users and extract the notes from them.





    submitButton.addEventListener("click", (event) => {
        // console.log(userNameInput.value);
        // console.log(noteInput.value);

        // userNames.push(userNameInput.value)

        userNames.set(userNameInput.value, noteInput.value);

        console.log(userNames);

        
    
        event.preventDefault();
    });
}

window.addEventListener("load", start);