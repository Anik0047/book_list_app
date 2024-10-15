// API URL for all books
const apiUrl = "https://gutendex.com/books/";
let books = []; // Array to store fetched books
let booksPerPage = 10; // Number of books to display per page
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
      document.getElementById("loader").style.display = "none";
    });
  })
  .catch((error) => {
    bookContainer.innerHTML =
      "<p>Error fetching books. Please try again later.</p>";
    console.error("Error fetching data:", error);
  });

// Get the search input element
const searchInput = document.querySelector(".search-bar input");

// Add event listener to the search bar
searchInput.addEventListener("input", (e) => {
  // Capture the search term and convert it to lowercase
  const searchTerm = e.target.value.toLowerCase();

  // Get the currently selected genre
  const selectedGenre = genreDropdown.value;

  // Filter books based on the search term and selected genre
  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm);
    const matchesGenre =
      selectedGenre === "" || book.subjects.includes(selectedGenre);

    // Return books that match both the search term and the selected genre
    return matchesTitle && matchesGenre;
  });

  // Check if any books match the search and genre criteria
  if (filteredBooks.length === 0) {
    bookContainer.innerHTML = "<p>No books found.</p>";
    return; // Stop rendering if no books match
  }

  // Render the filtered book list
  renderBooks(filteredBooks);
});

// Add event listener to the genre dropdown
genreDropdown.addEventListener("change", (e) => {
  const selectedGenre = e.target.value; // Get the selected genre

  // Get the current search term
  const searchTerm = searchInput.value.toLowerCase();

  // Filter books based on the selected genre and search term
  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm);
    const matchesGenre =
      selectedGenre === "" || book.subjects.includes(selectedGenre);

    return matchesTitle && matchesGenre;
  });

  // Clear the existing book list
  bookContainer.innerHTML = "";

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
    renderBookCard(book); // Render each book card
  });

  // Render pagination controls
  renderPagination(totalPages);
}

// Reference to booksPerPage dropdown
const booksPerPageDropdown = document.getElementById("booksPerPage");

// Change the number of books displayed per page
booksPerPageDropdown.addEventListener("change", (e) => {
  booksPerPage = parseInt(e.target.value);
  renderBooks();
});

// Function to render individual book cards
function renderBookCard(book) {
  const title = book.title;
  const author =
    book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
  const coverImage = book.formats["image/jpeg"] || "default-cover.jpg";
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
        <div class="book-btn">
        <a href="details.html?id=${id}" class="more-details-button">More Details</a>
        <button class="wishlist-button" data-id="${id}">
          <i class="fa-solid fa-heart" style="color:${
            isWishlisted ? "red" : "gray"
          }"></i>
        </button>
        </div>
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
    const bookId = button.getAttribute("data-id");

    // Toggle the wishlist status
    toggleWishlist(bookId);
    updateWishlistCount(); // Update count when wishlist is modified

    // Update the heart icon color based on the new wishlist status
    const heartIcon = button.querySelector(".fa-heart");
    heartIcon.style.color = isBookInWishlist(bookId) ? "red" : "gray";
  }
});

// Function to check if a book is in the wishlist
function isBookInWishlist(id) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(id); // This will return true if the book is in the wishlist
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

// Function to update wishlist counter
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  document.getElementById("wishlist-count").textContent = wishlist.length;
}

// Call this function after the page loads
updateWishlistCount();
