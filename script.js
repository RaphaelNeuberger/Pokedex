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

// ===== TAB FUNCTIONALITY =====
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
    });
  });
}

function switchTab(tabName) {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));

  const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
  const activeContent = document.getElementById(`${tabName}-tab`);

  if (activeButton && activeContent) {
    activeButton.classList.add("active");
    activeContent.classList.add("active");
  }
}

// ===== ENHANCED POKEMON DETAIL DISPLAY =====
function displayPokemonDetail(pokemon) {
  const typeColor = getTypeColor(pokemon.types[0].type.name);
  const typeColorLight = lightenColor(typeColor, 20);

  document.documentElement.style.setProperty("--type-color", typeColor);
  document.documentElement.style.setProperty(
    "--type-color-light",
    typeColorLight
  );

  const detailHeader = document.querySelector(".detail-header");
  detailHeader.style.background = `linear-gradient(180deg, ${typeColor} 0%, ${typeColorLight} 100%)`;

  document.getElementById("detailPokemonImage").src =
    pokemon.sprites.other["official-artwork"].front_default;
  document.getElementById("detailPokemonImage").alt = pokemon.name;
  document.getElementById("detailPokemonName").textContent = pokemon.name;
  document.getElementById("detailPokemonId").textContent = `#${formatPokemonId(
    pokemon.id
  )}`;
  document.getElementById("detailPokemonTypes").innerHTML = getTypeBadgesHTML(
    pokemon.types
  );

  fillAboutTab(pokemon);
  fillStatsTab(pokemon);
  fillEvolutionTab(pokemon);
  fillMovesTab(pokemon);
}

function fillAboutTab(pokemon) {
  document.getElementById("species").textContent = pokemon.name;
  document.getElementById("height").textContent = `${(
    pokemon.height / 10
  ).toFixed(1)} m`;
  document.getElementById("weight").textContent = `${(
    pokemon.weight / 10
  ).toFixed(1)} kg`;

  const abilities = pokemon.abilities.map((a) => a.ability.name).join(", ");
  document.getElementById("abilities").textContent = abilities;

  document.getElementById("eggGroups").textContent = "Monster, Grass";
  document.getElementById("eggCycle").textContent = "Grass";
}

function fillStatsTab(pokemon) {
  const statsContainer = document.getElementById("statsContainer");
  const maxStat = 255;

  statsContainer.innerHTML = pokemon.stats
    .map((stat) => {
      const percentage = (stat.base_stat / maxStat) * 100;
      const statColor = getStatColor(stat.base_stat);

      return `
            <div class="stat-row">
                <span class="stat-name">${formatStatName(stat.stat.name)}</span>
                <span class="stat-value">${stat.base_stat}</span>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${percentage}%; background: ${statColor};"></div>
                </div>
            </div>
        `;
    })
    .join("");

  document.getElementById("defensesPokemonName").textContent = pokemon.name;

  const typeEffectivenessGrid = document.getElementById(
    "typeEffectivenessGrid"
  );
  typeEffectivenessGrid.innerHTML = generateTypeEffectiveness(pokemon.types);
}

function fillEvolutionTab(pokemon) {
  const evolutionChain = document.getElementById("evolutionChain");
  evolutionChain.innerHTML =
    '<p class="info-message">Evolution chain feature coming soon!</p>';
}

function fillMovesTab(pokemon) {
  const movesList = document.getElementById("movesList");
  const moves = pokemon.moves.slice(0, 10);

  movesList.innerHTML = moves
    .map((move) => {
      return `
            <div class="move-item">
                <span class="move-name">${move.move.name}</span>
                <span class="move-type" style="background: ${getTypeColor(
                  "normal"
                )}">Normal</span>
            </div>
        `;
    })
    .join("");
}

function getStatColor(value) {
  if (value >= 150) return "#22c55e";
  if (value >= 100) return "#3b82f6";
  if (value >= 50) return "#f59e0b";
  return "#ef4444";
}

function generateTypeEffectiveness(types) {
  const allTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
  ];

  return allTypes
    .map((type) => {
      const multiplier = "1×";
      return `
            <div class="effectiveness-item">
                <div class="effectiveness-icon type-${type}">${type[0].toUpperCase()}</div>
                <span class="effectiveness-multiplier">${multiplier}</span>
            </div>
        `;
    })
    .join("");
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// ===== UPDATE INITIALIZATION =====
function init() {
  loadPokemon();
  attachEventListeners();
  initializeTabs(); // NEU!
}
