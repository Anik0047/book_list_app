// API URL for all books
const apiUrl = "https://gutendex.com/books/";
let books = []; // Array to store fetched books
const booksPerPage = 10; // Number of books to display per page
let currentPage = 1; // Current page number

// Reference to the container where books will be displayed
const bookContainer = document.getElementById("book-container");

// Reference to the genre dropdown
const genreDropdown = document.querySelector(".genre-dropdown");

// Fetch data from the API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Get the array of books
    books = data.results;

    // Render the initial list of books
    renderBooks();

    // Array to hold unique genres
    const uniqueGenres = new Set();

    // Loop through books to collect genres
    books.forEach((book) => {
      book.subjects.forEach((subject) => {
        uniqueGenres.add(subject); // Add each subject to the Set
      });
    });

    // Populate the genre dropdown
    uniqueGenres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre; // Set the option's value
      option.textContent = genre; // Set the option's display text
      genreDropdown.appendChild(option); // Append to the dropdown
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Get the search input element
const searchInput = document.querySelector(".search-bar input");

// Add event listener to the search bar
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase(); // Convert search term to lowercase

  // Filter books based on the search term
  const filteredBooks = books.filter((book) => {
    return book.title.toLowerCase().includes(searchTerm); // Match the search term with book titles
  });

  // Clear the existing book list
  bookContainer.innerHTML = "";

  // Render the filtered book list
  renderBooks(filteredBooks);
});

// Add event listener to the genre dropdown
genreDropdown.addEventListener("change", (e) => {
  const selectedGenre = e.target.value; // Get the selected genre

  // Clear the existing book list
  bookContainer.innerHTML = "";

  // Filter books based on the selected genre
  const filteredBooks = books.filter((book) => {
    // Show all books if no genre is selected
    if (selectedGenre === "") {
      return true;
    }
    // Check if any of the book's subjects match the selected genre
    return book.subjects.includes(selectedGenre); // Check for genre
  });

  // Render the filtered book list
  renderBooks(filteredBooks);
});

// Function to render a list of books
function renderBooks(bookList = books) {
  // Calculate the total number of pages
  const totalPages = Math.ceil(bookList.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = bookList.slice(startIndex, endIndex);

  // Clear the existing book list
  bookContainer.innerHTML = "";

  // Render the current page of books
  currentBooks.forEach((book) => {
    renderBookCard(book);
  });

  // Render pagination controls
  renderPagination(totalPages);
}

// Function to render a single book card
function renderBookCard(book) {
  const title = book.title;
  const author =
    book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
  const coverImage = book.formats["image/jpeg"] || "default-cover.jpg"; // Fallback if no cover image
  const genre = book.subjects.length > 0 ? book.subjects[0] : "Unknown Genre";
  const id = book.id;

  // Check if the book is already in the wishlist
  const isWishlisted = isBookInWishlist(id);

  // Create a book card dynamically
  const bookCard = `
    <div class="book-card">
      <img src="${coverImage}" alt="Book Cover" class="book-cover" />
      <div class="book-details">
        <h3 class="book-title">${title}</h3>
        <p class="book-author">by ${author}</p>
        <p class="book-genre">Genre: ${genre}</p>
        <p class="book-id">ID: ${id}</p>
        <button class="wishlist-button" data-id="${id}">
          <i class="fa-heart ${isWishlisted ? "fa-solid" : "fa-regular"}"></i>
        </button>
      </div>
    </div>
  `;

  // Append the book card to the container
  bookContainer.innerHTML += bookCard;
}

// Function to render pagination controls
function renderPagination(totalPages) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  // Create previous button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1; // Disable if on the first page
  prevButton.addEventListener("click", () => {
    currentPage--;
    renderBooks();
  });
  paginationContainer.appendChild(prevButton);

  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.toggle("active", i === currentPage); // Highlight the active page
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderBooks();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Create next button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages; // Disable if on the last page
  nextButton.addEventListener("click", () => {
    currentPage++;
    renderBooks();
  });
  paginationContainer.appendChild(nextButton);
}

// Event delegation for wishlist buttons
bookContainer.addEventListener("click", (e) => {
  if (e.target.closest(".wishlist-button")) {
    const button = e.target.closest(".wishlist-button");
    const bookId = button.getAttribute("data-id"); // Get the book ID

    // Toggle the wishlist status
    toggleWishlist(bookId);

    // Update the heart icon appearance
    const heartIcon = button.querySelector(".fa-heart");
    heartIcon.classList.toggle("fa-regular");
    heartIcon.classList.toggle("fa-solid");
  }
});

// Function to check if a book is in the wishlist
function isBookInWishlist(id) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(id);
}

// Function to add or remove a book from the wishlist
function toggleWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((bookId) => bookId !== id); // Remove from wishlist
  } else {
    wishlist.push(id); // Add to wishlist
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Save updated wishlist
}
