// Reference to the container where wishlisted books will be displayed
const wishlistContainer = document.getElementById("wishlist-container");

// Function to render a single book card
function renderBookCard(book) {
  const title = book.title;
  const author =
    book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
  const coverImage = book.formats["image/jpeg"] || "default-cover.jpg"; // Fallback if no cover image
  const genre = book.subjects.length > 0 ? book.subjects[0] : "Unknown Genre";
  const id = book.id;

  // Create a book card dynamically
  const bookCard = `
        <div class="book-card">
            <img src="${coverImage}" alt="Book Cover" class="book-cover" />
            <div class="book-details">
                <h3 class="book-title">${title}</h3>
                <p class="book-author">by ${author}</p>
                <p class="book-genre">Genre: ${genre}</p>
                <p class="book-id">ID: ${id}</p>
                <div class="book-btn-wishlist">
                  <a href="details.html?id=${id}" class="more-details-button">More Details</a>
                </div>
            </div>
        </div>
    `;

  // Append the book card to the container
  wishlistContainer.innerHTML += bookCard;
}

// Function to load the wishlist from localStorage
function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  // Fetch book data for each id in the wishlist
  wishlist.forEach((id) => {
    fetch(`https://gutendex.com/books/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        const book = data; // Assuming API returns a book object
        renderBookCard(book); // Render the book card
      })
      .catch((error) => {
        console.error("Error fetching wishlist book data:", error);
      });
  });
}

// Load the wishlist when the page loads
window.onload = loadWishlist;
