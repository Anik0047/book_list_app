const wishlistContainer = document.getElementById("wishlist-container");
const emptyWishlist = document.getElementById("empty-wishlist");
const loader = document.getElementById("loader");


function renderBookCard(book) {
  const title = book.title;
  const author =
    book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
  const coverImage = book.formats["image/jpeg"] || "default-cover.jpg"; 
  const genre = book.subjects.length > 0 ? book.subjects[0] : "Unknown Genre";
  const id = book.id;

  
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

  
  wishlistContainer.innerHTML += bookCard;
}


function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  
  loader.style.display = "none";

  if (wishlist.length === 0) {
    emptyWishlist.innerHTML = "<p class='empty-wishlist'>Your wishlist is empty.</p>";
    return;
  }

 
  wishlist.forEach((id) => {
    fetch(`https://gutendex.com/books/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        const book = data; 
        renderBookCard(book); 
      })
      .catch((error) => {
        console.error("Error fetching wishlist book data:", error);
      });
  });
}


window.onload = loadWishlist;
