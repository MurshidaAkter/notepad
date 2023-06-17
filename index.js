// var declaration -->
var noteAmount = 0;
var noteEntered = false;

// find the elements
const noteForm = document.querySelector(".note-form");
const addNoteButton = noteForm.querySelector('#addNoteButton');
const noteInput = document.querySelector("#inputNote");
const cardContainer = document.querySelector('.card-container');
const deleteAll = document.querySelector('#deleteAll');
const messageElement = document.querySelector('#msg');
const textArea = document.querySelector('textarea');
const totalNotes = document.querySelector('#totalNotes');
const emptyMsg = document.querySelector('#emptyMsg');
const inputTitle = document.querySelector('#inputTitle');


// Other Functions -->
const updateNoteAmount = () =>{
    totalNotes.innerHTML = noteAmount +" notes"
}

const emptyContainer = () => {
    if(noteAmount == 0){
        emptyMsg.textContent = "empty pad!";
    }else{
            emptyMsg.textContent = "";
    };
}

// getTodosFromLocalStorage
const getNotesFromLocalStorage = () => {
    const notesInLS = localStorage.getItem("myNotes") ? JSON.parse(localStorage.getItem("myNotes")): [];
    return notesInLS;
};


// Show Message -->
const showMessage = (text, status) => {
    messageElement.textContent = text;
    messageElement.classList.add(`bg-${status}`);
    setTimeout(() => {
      messageElement.textContent = "";
      messageElement.classList.remove(`bg-${status}`);
    }, 3000);
};


// Functions of Event Listeners -->

// deleteCard
const deleteCard = (event) => {
    noteAmount--
    updateNoteAmount(noteAmount);
    emptyContainer();
    const selectedCard = event.target.parentElement.parentElement;
    cardContainer.removeChild(selectedCard);


    showMessage("a note was deleted !!", "delete");
  
    let notes = getNotesFromLocalStorage();
    notes = notes.filter((note) => note.cardId !== selectedCard.id);
    localStorage.setItem("myNotes", JSON.stringify(notes));
  };

// create Note Card
 const createCard = (cardValue, cardId, date, cardTitle) => {
    const cardElement = document.createElement("div");
    cardElement.id = cardId;

    cardElement.classList.add("card");
    cardElement.classList.add("flex");

    cardElement.innerHTML = `
      <h3 class="card-title"> ${cardTitle} </h3>
        <p class = "dateFont">${date}</p>
        <span class = "bodyFont"> ${cardValue} </span>
        <hr class="card-hr">
      <span id="deleteButton"> <i class="fa fa-trash deleteButton"> </i> </span>
      `;
    cardContainer.appendChild(cardElement);
    const deleteButton = cardElement.querySelector("#deleteButton");
    deleteButton.addEventListener("click", deleteCard);
   };

// Add card --->
const addCard = (event) => {
    event.preventDefault();

    noteAmount++
    updateNoteAmount(noteAmount)
    emptyContainer();

    const cardTitle = inputTitle.value;
    // console.log(cardTitle);
    const cardValue = noteInput.value;

    // unique id
    const cardId = Date.now().toString();

    // Date -->
    const currentDate = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = String(currentDate.toLocaleDateString('en-us', options));

    // element creation
    createCard(cardValue, cardId, date, cardTitle);

    // add notes[card] to localStorage
    const notes = getNotesFromLocalStorage();

    notes.push({cardId,cardValue,date,cardTitle});
    localStorage.setItem("myNotes", JSON.stringify(notes));

    noteInput.value = "";
    inputTitle.value = "";
}

// load Notes from LS on refresh
const loadNotes = () => {
    const notes = getNotesFromLocalStorage();
    console.log(notes);

    noteAmount = notes.length;
    emptyContainer();
    updateNoteAmount(noteAmount);
    notes.map((note) => createCard(note.cardValue, note.cardId, note.date, note.cardTitle));
};


// snippets -->
addNoteButton.disabled = true;

// Event Listeners -->
noteForm.addEventListener("submit", addCard);

textArea.addEventListener('click',()=>{
    textArea.value = ''
    addNoteButton.disabled = false;
})

deleteAll.addEventListener('click',()=>{

    if(confirm("All the notes will be deleted parmanently")){
        localStorage.clear();
        loadNotes();
        cardContainer.innerHTML = '';
    }
})

window.addEventListener("DOMContentLoaded", loadNotes);


  