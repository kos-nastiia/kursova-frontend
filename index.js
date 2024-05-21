document.getElementById('addBookForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const author = document.getElementById('inputAuthor').value;
  const title = document.getElementById('inputTitle').value;
  const year = document.getElementById('inputYear').value;
  const count = document.getElementById('inputCount').value;

  if (!author.trim() || !title.trim() || !year.trim() || !count.trim()) {
    alert('All fields are required');
    return;
  }  

  if (!/^\d+$/.test(year)) {
    alert('Year must be a number');
    return;
  }

  if (!/^\d+$/.test(count)) {
    alert('Count must be a number');
    return;
  }

  const book = { author, title, year, count };

  fetch('http://localhost:8080/book/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
  }).then(() => {
      console.log('New book added');
      location.reload();
  }).catch(error => {
      console.error('Error adding book:', error);
  });

  document.getElementById('inputAuthor').value = '';
  document.getElementById('inputTitle').value = '';
  document.getElementById('inputYear').value = '';
  document.getElementById('inputCount').value = '';
});


function renderBooksTable(data) {
  const tableBody = document.getElementById('books-table-body');
  tableBody.innerHTML = '';

  data.forEach((book, index) => {
    const row = document.createElement('tr');
    row.classList.add('text-center', 'align-middle');

    const inputNumber = document.createElement('input');
    inputNumber.type = 'number';
    inputNumber.classList.add('form-control');
    inputNumber.id = 'typeNumber';
    inputNumber.min = 1;
    inputNumber.max = book.count;

    const editIcon = document.createElement('i');
    editIcon.classList.add('bi', 'bi-pencil', 'm-3');
    editIcon.style.cursor = 'pointer';
    editIcon.onclick = function() {
      editBook(book.id);
    };

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('bi', 'bi-trash', 'm-3');
    trashIcon.style.cursor = 'pointer';
    trashIcon.onclick = function() {
      const countToDelete = inputNumber.value;
      fetch(`http://localhost:8080/book/delete/${book.id}?count=${countToDelete}`, {
        method: 'DELETE'
      })
      .then(() => {
        console.log(`Deleted ${countToDelete} books with ID ${book.id}`);
        fetchBooksAndUpdateTable();
      })
      .catch(error => {
        console.error('Error deleting books:', error);
      });
    };

    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${book.author}</td>
      <td>${book.title}</td>
      <td>${book.year}</td>
      <td>${book.count}</td>
      <td>
        <div class="d-flex align-items-center inline-elements">
          <div data-mdb-input-init class="form-outline d-flex align-items-center inline-elements">
          </div>
        </div>
      </td>
    `;

    const inputDiv = row.querySelector('.form-outline');
    inputDiv.appendChild(inputNumber);
    inputDiv.appendChild(trashIcon);
    
    tableBody.appendChild(row);
  });
}

function fetchBooksAndUpdateTable() {
  fetch('http://localhost:8080/book/getAll')
    .then(response => response.json())
    .then(data => {
      renderBooksTable(data);
    })
    .catch(error => {
      console.error('Error fetching books:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const sortByAuthorBtn = document.getElementById('sortByAuthorBtn');
  const sortByYearBtn = document.getElementById('sortByYearBtn');

  sortByAuthorBtn.addEventListener('click', function() {
    fetch('http://localhost:8080/book/getAllSortedByAuthor')
      .then(response => response.json())
      .then(data => {
        renderBooksTable(data);
      })
      .catch(error => {
        console.error('Error fetching sorted books by author:', error);
      });
  });

  sortByYearBtn.addEventListener('click', function() {
    fetch('http://localhost:8080/book/getAllSortedByYear')
      .then(response => response.json())
      .then(data => {
        renderBooksTable(data);
      })
      .catch(error => {
        console.error('Error fetching sorted books by year:', error);
      });
  });

  fetchBooksAndUpdateTable();
});
