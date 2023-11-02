let input = document.querySelector("input");
let movieContainer = document.querySelector("#movie");
let pagination = document.querySelector("#pages");
let prevBtn = document.querySelector("#prev");
let nextBtn = document.querySelector("#next");
let navbar = document.querySelector("nav");
let myDialog = document.querySelector("#myDialog");
let modal = document.querySelector(".modal");
let apiKey = "1ca6ed19";
let pageNo = 1;
prevBtn.disabled = true;

//TODO Append All Movies and pages
function appendData(data) {
  if (pageNo == 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
  movieContainer.innerHTML = "";
  if (data.Response == "True") {
    data.Search.forEach((ele) => {
      if (ele.Poster == "N/A") {
        ele.Poster = "./istockphoto-123493018-612x612.jpg";
      }
      let div = document.createElement("div");
      div.setAttribute("onclick", `showDetails('${ele.imdbID}')`);
      div.classList.add("movie-card");
      div.innerHTML = `
            <div class="movie-img">
                <img src="${ele.Poster}" alt="photo not found">
            </div>
            <h3 class="movie-title">${ele.Title}</h3>
            <p class="movie-year">Year: ${ele.Year}</p>
            `;
      movieContainer.appendChild(div);
      let totalPages =
        Math.floor(data.totalResults / 10) +
        (data.totalResults % 10 > 0 ? 1 : 0);
      if (pageNo == totalPages) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
      pagination.innerHTML = `Page <span id = "curr">${pageNo}</span> of ${totalPages}`;
    });
  } else {
    movieContainer.innerText =
      "Too many results. Please provide a more specific search term.";
    pagination.innerHTML = `Page <span id = "curr">1</span>`;
  }
}

//TODO function to fetch data of all Movies
async function fetchAPI() {
  let searchStr = input.value;
  if (searchStr == "") {
    movieContainer.innerText = "Please enter a search term";
    pagination.innerHTML = `Page <span id = "curr">1</span>`;
  } else {
    let data = null;
    try {
      data = await fetch(
        ` https://www.omdbapi.com/?&apikey=${apiKey}&s=${searchStr}&page=${pageNo}&plot=short`
      );
      data = await data.json();
      appendData(data);
    } catch (err) {
      console.log(err);
    }
  }
}

//TODO Debounce Function
function debounce(fetchAPI, delay) {
  let timeOutId;
  return () => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(fetchAPI, delay);
  };
}

let debounceMovies = debounce(fetchAPI, 300);

//TODO Event on input
input.addEventListener("input", (e) => {
  pageNo = 1;
  debounceMovies();
});

//TODO Click Event on Prev button
prevBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (pageNo > 1) {
    prevBtn.disabled = false;
    pageNo--;
    debounceMovies();
  }
});

//TODO Click Event on Next button
nextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  pageNo++;
  debounceMovies();
});

//TODO Navbar scroll
movieContainer.addEventListener("scroll", (e) => {
  console.log(e.target.scrollTop);
  if (e.target.scrollTop > 100) {
    navbar.style.backgroundColor = "transparent";
  } else {
    navbar.style.backgroundColor = "rgb(211, 247, 235)";
  }
});

//TODO Show details Function
async function showDetails(id) {
  document.body.style.overflow = "hidden";
  const data = await fetch(
    `http://www.omdbapi.com/?&apikey=1ca6ed19&i=${id}&plot=full`
  );
  let movieData = await data.json();
  if (movieData.Poster == "N/A") {
    movieData.Poster = "./istockphoto-123493018-612x612.jpg";
  }
  modal.innerHTML = `
    <svg
          onclick="closeDialog()"
          id="closeBtn"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#7d7a78"
            d="M3 16.74L7.76 12L3 7.26L7.26 3L12 7.76L16.74 3L21 7.26L16.24 12L21 16.74L16.74 21L12 16.24L7.26 21L3 16.74m9-3.33l4.74 4.75l1.42-1.42L13.41 12l4.75-4.74l-1.42-1.42L12 10.59L7.26 5.84L5.84 7.26L10.59 12l-4.75 4.74l1.42 1.42L12 13.41Z"
          />
        </svg>
        <img id="modal-img" src="${movieData.Poster}" alt="" />
        <div class="modal-details">
          <h2>Title: ${movieData.Title}</h2>
          <p>
            <span>Plot</span>: ${movieData.Plot}
          </p>
          <p>
            <span>Actors</span>: ${movieData.Actors}
          </p>
          <p><span>Director(s)</span>: ${movieData.Director}</p>
          <p>
            <span>Writer(s)</span>: ${movieData.Writer}
          </p>
          <p><span>Genres</span>: ${movieData.Genre}</p>
          <p><span>Released</span>: ${movieData.Released}</p>
          <p><span>IMDB Rating</span>: ${movieData.imdbRating}/10</p>
          <p><span>Language</span>: ${movieData.Language}</p>
          <p><span>Country</span>: ${movieData.Country}</p>
        </div>`;
  console.log("test");
  myDialog.show();
}

function closeDialog() {
  document.body.style.overflowY = "scroll";
  myDialog.close();
}
myDialog.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.id == "myDialog") {
    closeDialog();
  }
});
