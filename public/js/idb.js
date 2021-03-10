// create a variable to hold the database connection
let db;
// establish a connection to IndexedDB database called "budget_tracker" and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will emit even if the database version changes
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store called 'new_budget', set it to have an icrementing primary key
    db.createObjectStore('new_budget', { autoIncrement: true });
};

// when there is a successfull connection to the database, store the resulting database object to the global 'db' variable
request.onsuccess = function(event) {
    // when db is successfully created save to global 'db' variable
    db = event.target.result;

    // check to see if the app was oneline, if it was upload all db data to api
    if (navigator.onLine) {
        uploadBudget();
    }
};

// inform us if anything goes wrong connecting to the database
request.onerror = function(event) {
    // console log the error
    console.log(event.target.errorCode);
};


// if there is no internet connection this function will execute if a budget is submitted
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access the object store for 'new_budget'
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add a record to the store
    budgetObjectStore.add(record);
}