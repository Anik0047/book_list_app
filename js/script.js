
const apiUrl = "https://gutendex.com/books/";
let books = []; 
let filteredBooks = []; 
let booksPerPage = 10; 
let currentPage = 1; 


const bookContainer = document.getElementById("book-container");


const genreDropdown = document.querySelector(".genre-dropdown");


fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    
    books = data.results;
    filteredBooks = books; 

    
    renderBooks();

    
    const uniqueGenres = new Set();

    
    books.forEach((book) => {
      book.subjects.forEach((subject) => {
        uniqueGenres.add(subject); 
      });
    });

    
    uniqueGenres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre; 
      option.textContent = genre; 
      genreDropdown.appendChild(option); 
    });

    document.getElementById("loader").style.display = "none";
  })
  .catch((error) => {
    bookContainer.innerHTML =
      "<p>Error fetching books. Please try again later.</p>";
    console.error("Error fetching data:", error);
  });


const searchInput = document.querySelector(".search-bar input");


function filterBooks() {
  const searchTerm = searchInput.value.toLowerCase(); 
  const selectedGenre = genreDropdown.value; 
  
  filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm);
    const matchesGenre =
      selectedGenre === "" || book.subjects.includes(selectedGenre);
    return matchesTitle && matchesGenre;
  });

  currentPage = 1; 
  renderBooks(); 
}


searchInput.addEventListener("input", filterBooks);


genreDropdown.addEventListener("change", filterBooks);


function renderBooks() {
  
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex); 

 
  bookContainer.innerHTML = "";

  
  currentBooks.forEach((book) => {
    renderBookCard(book); 
  });

  
  renderPagination(totalPages);
}


const booksPerPageDropdown = document.getElementById("booksPerPage");


booksPerPageDropdown.addEventListener("change", (e) => {
  booksPerPage = parseInt(e.target.value);
  currentPage = 1; 
  renderBooks(); 
});


function renderBookCard(book) {
  const title = book.title;
  const author =
    book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
  const coverImage = book.formats["image/jpeg"] || "default-cover.jpg";
  const genre = book.subjects.length > 0 ? book.subjects[0] : "Unknown Genre";
  const id = book.id;

 
  const isWishlisted = isBookInWishlist(id);

  
  const bookCardElement = document.createElement('div');
bookCardElement.classList.add('book-card');
bookCardElement.innerHTML = `
  <img src="${coverImage}" alt="Book Cover" class="book-cover" />
  <div class="book-details">
    <h3 class="book-title">${title}</h3>
    <p class="book-author">by ${author}</p>
    <p class="book-genre">Genre: ${genre}</p>
    <p class="book-id">ID: ${id}</p>
    <div class="book-btn">
      <a href="details.html?id=${id}" class="more-details-button">More Details</a>
      <button class="wishlist-button" data-id="${id}">
        <i class="fa-solid fa-heart" style="color:${isWishlisted ? 'red' : 'gray'}"></i>
      </button>
    </div>
  </div>`;
bookContainer.appendChild(bookCardElement);

}


function renderPagination(totalPages) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; 

 
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1; 
  prevButton.addEventListener("click", () => {
    currentPage--;
    renderBooks();
  });
  paginationContainer.appendChild(prevButton);

 
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.toggle("active", i === currentPage); 
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderBooks();
    });
    paginationContainer.appendChild(pageButton);
  }

  
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages; 
  nextButton.addEventListener("click", () => {
    currentPage++;
    renderBooks();
  });
  paginationContainer.appendChild(nextButton);
}


bookContainer.addEventListener("click", (e) => {
  if (e.target.closest(".wishlist-button")) {
    const button = e.target.closest(".wishlist-button");
    const bookId = button.getAttribute("data-id");

    
    toggleWishlist(bookId);
    updateWishlistCount(); 

 
    const heartIcon = button.querySelector(".fa-heart");
    heartIcon.style.color = isBookInWishlist(bookId) ? "red" : "gray";
  }
});


function isBookInWishlist(id) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.includes(id);
}


function toggleWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((bookId) => bookId !== id); 
  } else {
    wishlist.push(id); 
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist)); 
}


function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  document.getElementById("wishlist-count").textContent = wishlist.length;
}


updateWishlistCount();


function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}
