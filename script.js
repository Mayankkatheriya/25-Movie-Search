let input = document.querySelector("input")
let movieContainer = document.querySelector("#movie")
let pagination = document.querySelector("#pages")
let prevBtn = document.querySelector("#prev")
let nextBtn = document.querySelector("#next")
let apiKey = "1ca6ed19";
let pageNo = 1
prevBtn.disabled = true;

function appendData(data){
    if(pageNo==1){
        prevBtn.disabled = true;
    }
    else{
        prevBtn.disabled = false;
    }
    movieContainer.innerHTML = ""
    if(data.Response=="True"){
        data.Search.forEach(ele => {
            let div = document.createElement("div")
            div.classList.add("movie-card");
            div.innerHTML = `
            <div class="movie-img">
                <img src="${ele.Poster}" alt="Poster">
            </div>
            <h3 class="movie-title">${ele.Title}</h3>
            <p class="movie-year">Year: ${ele.Year}</p>
            `
            movieContainer.appendChild(div);
            let totalPages = Math.floor(data.totalResults/10) + ((data.totalResults%10) > 0 ? 1 : 0)
            if(pageNo==totalPages){
                nextBtn.disabled = true;
            }
            else{
                nextBtn.disabled = false;
            }
            pagination.innerText =  `Page ${pageNo} of ${totalPages}`
        });
    }
    else{
        movieContainer.innerText = "Too many results. Please provide a more specific search term."
        pagination.innerText =  `Page 1`
    }

}
async function fetchAPI() {
    let searchStr = input.value;
    if(searchStr==""){
        movieContainer.innerText = "Please enter a search term"
        pagination.innerText =  `Page 1`
    }
    else{
        let data = null;
        try {
            data = await fetch(` https://www.omdbapi.com/?&apikey=${apiKey}&s=${searchStr}&page=${pageNo}`);
            data = await data.json()
            appendData(data);
        }
        catch(err){
            console.log(err);
        }
    }
    
}
function debounce(fetchAPI, delay){
    let timeOutId;
    return ()=>{
        if(timeOutId){
            clearTimeout(timeOutId)
        }
        timeOutId = setTimeout(fetchAPI, delay)
    }
}

let debounceMovies = debounce(fetchAPI, 300)
input.addEventListener("input", (e)=>{
    pageNo=1
    debounceMovies()
});

prevBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    if(pageNo>1){
        prevBtn.disabled = false
        pageNo--;
        debounceMovies();
    }
})
nextBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    pageNo++;
    debounceMovies();
})