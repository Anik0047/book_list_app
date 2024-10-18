const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");


const bookDetailsContainer = document.getElementById("book-details-container");


fetch(`https://gutendex.com/books/${bookId}/`)
  .then((response) => response.json())
  .then((book) => {
    
    const title = book.title;
    const author =
      book.authors.length > 0 ? book.authors[0].name : "Unknown Author";
    const coverImage = book.formats["image/jpeg"] || "default-cover.jpg";
    const genre = book.subjects.length > 0 ? book.subjects[0] : "Unknown Genre";
    const description = book.description || "No description available.";
    document.getElementById("loader").style.display = "none";

    
    bookDetailsContainer.innerHTML = `
      <div class="book-details-page">
        <img src="${coverImage}" alt="Book Cover" class="book-cover" />
        <div class="book-info">
          <h1>${title}</h1>
          <p><strong>Author:</strong> ${author}</p>
          <p><strong>Genre:</strong> ${genre}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Published:</strong> ${book.download_count} downloads</p>
          <!-- You can add more details as needed -->
        </div>
      </div>
    `;
  })
  .catch((error) => {
    console.error("Error fetching book details:", error);
    bookDetailsContainer.innerHTML = "<p>Error loading book details.</p>";
  });
