const sortSelect = document.getElementById("sortSelect");

// select the filterForm and add an on change event
// if there is a change in the form, by selecting one of the values
// force the form to submit, since it has no button 
sortSelect.addEventListener("change", () => {
    sortSelect.form.submit(); 
});

// function to populate the inputs of the update modal with the previous stored version
function populateUpdateModal(bookId, title, rating, notes, olid) {
    document.getElementById("updateBookId").value = bookId;
    document.getElementById("updateBookTitle").value = title;
    document.getElementById("updateBookRating").value = rating;
    document.getElementById("updateBookNotes").value = notes;
    document.getElementById("updateBookOLID").value = olid;
}