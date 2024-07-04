const API = "https://pokeapi.co/api/v2/pokemon"
const LIMIT = 20;

const container = document.getElementById("pokemons-cont");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageDiv = document.getElementById("page");

const getData = async (page)=>{
    const offset = (page*LIMIT)- LIMIT
    try {
        const response = await fetch(`${API}?offset=${offset}&limit=${LIMIT}`);
        const data = await response.json();

        return data.results;

    } catch (error) {
        console.log(`Hubo un error: ${error}`);
    }
}
const getIndividualInfo = async (url)=>{
    const res = await fetch(url);
    const pokemonData = await res.json();
    return pokemonData;
}
const arrayOfPromises = (arrayData)=>{
        return arrayData.map(element=> {
            return getIndividualInfo(element.url)
        })
    }

const getPokemons = async function(page){
    try {
        const arrayData = await getData(page);
        const arrayPromises = arrayOfPromises(arrayData);

        const pokemons = Promise.all(arrayPromises)
        .then((pokemon)=>{
            return pokemon
        })
        .catch((error)=>{
            console.error(error);
        })
        return pokemons
    } catch (error) {
        console.error(error);
    }
}
const showPokemon = async(page=1)=>{
    const memory = Number(localStorage.getItem("actualPage"));
    if (memory){
        page = memory;
        pageDiv.innerHTML = page;
    }
    localStorage.setItem("actualPage",`${page}`)
    let html = "";
    try {
        
        const pokemons = await getPokemons(page);
        pokemons.forEach(({base_experience, height, id, name, weight}) => {
            html+= `
                        <article class="pokemon">
                                <h2>${name.toUpperCase()}</h2>
                                <ul>
                                    <li>N° ID: ${id}</li>
                                    <li>Altura: ${height}</li>
                                    <li>Peso: ${weight}</li>
                                    <li>Experiencia: ${base_experience}</li>
                                </ul>
                        </article>
                        `
        }); 
        container.innerHTML = html;
        return "hello"
    } catch (error) {
        console.log(`Hubo un error: ${error}`);
    }
}

const nextPage = ()=>{
    const actualPage = Number(localStorage.getItem("actualPage"));
    localStorage.setItem("actualPage",`${pageDiv}`)
    pageDiv.innerHTML = actualPage+1;

    showPokemon(actualPage+1)
}
const prevPage = ()=>{
    const actualPage = Number(localStorage.getItem("actualPage"));
    if(actualPage<2){
        return alert("No puedes retroceder más");
    }
    localStorage.setItem("actualPage",`${pageDiv}`)
    pageDiv.innerHTML = actualPage-1;
    showPokemon(actualPage-1)
}
nextButton.addEventListener("click", nextPage);
prevButton.addEventListener("click", prevPage);

showPokemon();

