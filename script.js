// ===== GLOBAL VARIABLES =====
const POKEMON_API_BASE = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const LIMIT = 20;
let allLoadedPokemon = [];
let currentDetailIndex = 0;

// ===== DOM ELEMENTS =====
const pokemonContainer = document.getElementById("pokemonContainer");
const loadMoreButton = document.getElementById("loadMoreButton");
const loadingScreen = document.getElementById("loadingScreen");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const overlay = document.getElementById("pokemonOverlay");
const overlayBackground = document.getElementById("overlayBackground");
const closeButton = document.getElementById("closeButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const detailContent = document.getElementById("pokemonDetailContent");

// ===== INITIALIZATION =====
function init() {
  loadPokemon();
  attachEventListeners();
}

function attachEventListeners() {
  loadMoreButton.addEventListener("click", loadMorePokemon);
  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", handleSearchEnter);
  closeButton.addEventListener("click", closeOverlay);
  overlayBackground.addEventListener("click", closeOverlay);
  prevButton.addEventListener("click", showPreviousPokemon);
  nextButton.addEventListener("click", showNextPokemon);
}

// ===== FETCH POKEMON DATA =====
async function loadPokemon() {
  showLoading(true);
  disableLoadButton(true);

  try {
    const url = `${POKEMON_API_BASE}?offset=${currentOffset}&limit=${LIMIT}`;
    const response = await fetch(url);
    const data = await response.json();

    await renderPokemonList(data.results);
    currentOffset += LIMIT;
  } catch (error) {
    console.error("Error loading Pokemon:", error);
    showError();
  } finally {
    showLoading(false);
    disableLoadButton(false);
  }
}

function loadMorePokemon() {
  loadPokemon();
}

// ===== RENDER POKEMON CARDS =====
async function renderPokemonList(pokemonList) {
  for (const pokemon of pokemonList) {
    const pokemonData = await fetchPokemonDetails(pokemon.url);
    allLoadedPokemon.push(pokemonData);
    renderPokemonCard(pokemonData);
  }
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

function renderPokemonCard(pokemon) {
  const card = createPokemonCardElement(pokemon);
  pokemonContainer.appendChild(card);
}

function createPokemonCardElement(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);
  card.innerHTML = getPokemonCardHTML(pokemon);
  card.addEventListener("click", () => openPokemonDetail(pokemon.id - 1));
  return card;
}

function getPokemonCardHTML(pokemon) {
  return `
        <div class="pokemon-id">#${formatPokemonId(pokemon.id)}</div>
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" 
             alt="${pokemon.name}" 
             class="pokemon-image">
        <h2 class="pokemon-name">${pokemon.name}</h2>
        <div class="pokemon-types">
            ${getTypeBadgesHTML(pokemon.types)}
        </div>
    `;
}

function getTypeBadgesHTML(types) {
  return types
    .map(
      (typeInfo) =>
        `<span class="type-badge type-${typeInfo.type.name}">
            ${typeInfo.type.name}
        </span>`
    )
    .join("");
}

// ===== POKEMON DETAIL OVERLAY =====
function openPokemonDetail(index) {
  currentDetailIndex = index;
  const pokemon = allLoadedPokemon[index];
  displayPokemonDetail(pokemon);
  showOverlay();
}

function displayPokemonDetail(pokemon) {
  detailContent.innerHTML = getPokemonDetailHTML(pokemon);
}

function getPokemonDetailHTML(pokemon) {
  return `
        <div class="detail-header" 
             style="background: ${getTypeColor(pokemon.types[0].type.name)}20;">
            <img src="${
              pokemon.sprites.other["official-artwork"].front_default
            }" 
                 alt="${pokemon.name}" 
                 class="detail-image">
            <h2 class="detail-name">${pokemon.name}</h2>
            <div class="pokemon-types">
                ${getTypeBadgesHTML(pokemon.types)}
            </div>
            <p class="pokemon-id">#${formatPokemonId(pokemon.id)}</p>
        </div>
        <div class="detail-stats">
            <h3>Base Stats</h3>
            ${getStatsHTML(pokemon.stats)}
        </div>
        <div class="detail-info">
            <div class="stat-row">
                <span class="stat-name">Height</span>
                <span class="stat-value">${pokemon.height / 10} m</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">Weight</span>
                <span class="stat-value">${pokemon.weight / 10} kg</span>
            </div>
        </div>
    `;
}

function getStatsHTML(stats) {
  return stats
    .map(
      (stat) => `
        <div class="stat-row">
            <span class="stat-name">${formatStatName(stat.stat.name)}</span>
            <span class="stat-value">${stat.base_stat}</span>
        </div>
    `
    )
    .join("");
}

function formatStatName(statName) {
  return statName.replace("-", " ");
}

function showPreviousPokemon() {
  if (currentDetailIndex > 0) {
    currentDetailIndex--;
    displayPokemonDetail(allLoadedPokemon[currentDetailIndex]);
  }
}

function showNextPokemon() {
  if (currentDetailIndex < allLoadedPokemon.length - 1) {
    currentDetailIndex++;
    displayPokemonDetail(allLoadedPokemon[currentDetailIndex]);
  }
}

// ===== SEARCH FUNCTIONALITY =====
async function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm.length < 3) {
    alert("Please enter at least 3 characters");
    return;
  }

  await searchPokemon(searchTerm);
}

function handleSearchEnter(event) {
  if (event.key === "Enter") {
    handleSearch();
  }
}

async function searchPokemon(searchTerm) {
  showLoading(true);

  try {
    const response = await fetch(`${POKEMON_API_BASE}/${searchTerm}`);
    if (!response.ok) throw new Error("Pokemon not found");

    const pokemon = await response.json();
    displaySearchResult(pokemon);
  } catch (error) {
    alert("Pokémon not found! Please try another name or ID.");
  } finally {
    showLoading(false);
  }
}

function displaySearchResult(pokemon) {
  pokemonContainer.innerHTML = "";
  allLoadedPokemon = [pokemon];
  renderPokemonCard(pokemon);
}

// ===== OVERLAY CONTROLS =====
function showOverlay() {
  overlay.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closeOverlay() {
  overlay.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

// ===== HELPER FUNCTIONS =====
function showLoading(show) {
  if (show) {
    loadingScreen.classList.remove("hidden");
  } else {
    loadingScreen.classList.add("hidden");
  }
}

function disableLoadButton(disable) {
  loadMoreButton.disabled = disable;
}

function formatPokemonId(id) {
  return String(id).padStart(3, "0");
}

function getTypeColor(type) {
  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };
  return typeColors[type] || "#A8A77A";
}

function showError() {
  alert("Error loading Pokémon. Please try again.");
}

// ===== START APPLICATION =====
init();
