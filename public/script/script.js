const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", () => {
    sortSelect.form.submit(); 
});

function populateUpdateModal(bookId, title, rating, notes, olid) {
    document.getElementById("updateBookId").value = bookId;
    document.getElementById("updateBookTitle").value = title;
    document.getElementById("updateBookRating").value = rating;
    document.getElementById("updateBookNotes").value = notes;
    document.getElementById("updateBookOLID").value = olid;
}