function start() {

    const notesButton = document.querySelector('#get-notes-button'); 

    notesButton.addEventListener('click', (event) => {
        console.log('Notes button pressed!'); 
        event.preventDefault(); 
    }); 
}

window.addEventListener("load", start);