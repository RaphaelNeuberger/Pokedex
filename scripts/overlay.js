// ===== POKEMON DETAIL OVERLAY =====

function openPokemonDetail(index) {
  currentDetailIndex = index;
  const pokemon = allLoadedPokemon[index];
  displayPokemonDetail(pokemon);
  showOverlay();
  updateNavigationButtons();
}

function displayPokemonDetail(pokemon) {
  applyTypeColors(pokemon);
  updateDetailHeader(pokemon);
  fillAllTabs(pokemon);
  updateAllFavoriteButtons(pokemon.id);
  attachFavoriteListener(pokemon.id);
}

function applyTypeColors(pokemon) {
  const typeColor = getTypeColor(pokemon.types[0].type.name);
  const typeColorLight = lightenColor(typeColor, 20);

  document.documentElement.style.setProperty("--type-color", typeColor);
  document.documentElement.style.setProperty(
    "--type-color-light",
    typeColorLight
  );

  const detailHeader = document.querySelector(".detail-header");
  detailHeader.style.background = `linear-gradient(180deg, ${typeColor} 0%, ${typeColorLight} 100%)`;
}

function updateDetailHeader(pokemon) {
  document.getElementById("detailPokemonImage").src =
    pokemon.sprites.other["official-artwork"].front_default;
  document.getElementById("detailPokemonImage").alt = pokemon.name;
  document.getElementById("detailPokemonName").textContent = pokemon.name;
  document.getElementById("detailPokemonId").textContent = `#${formatPokemonId(
    pokemon.id
  )}`;
  document.getElementById("detailPokemonTypes").innerHTML =
    getTypeBadgesTemplate(pokemon.types);
}

function fillAllTabs(pokemon) {
  fillAboutTab(pokemon);
  fillStatsTab(pokemon);
  fillEvolutionTab(pokemon);
  fillMovesTab(pokemon);
}

function attachFavoriteListener(pokemonId) {
  const favoriteBtn = document.getElementById("favoriteButton");
  const newBtn = favoriteBtn.cloneNode(true);
  favoriteBtn.parentNode.replaceChild(newBtn, favoriteBtn);

  newBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(pokemonId);
  });
}

function updateNavigationButtons() {
  prevButton.disabled = currentDetailIndex === 0;
  nextButton.disabled = currentDetailIndex === allLoadedPokemon.length - 1;
}

function showPreviousPokemon() {
  if (currentDetailIndex > 0) {
    currentDetailIndex--;
    displayPokemonDetail(allLoadedPokemon[currentDetailIndex]);
    updateNavigationButtons();
  }
}

function showNextPokemon() {
  if (currentDetailIndex < allLoadedPokemon.length - 1) {
    currentDetailIndex++;
    displayPokemonDetail(allLoadedPokemon[currentDetailIndex]);
    updateNavigationButtons();
  }
}

function showOverlay() {
  overlay.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closeOverlay() {
  overlay.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

// ===== TAB FUNCTIONALITY =====

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
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

// ===== FILL TAB CONTENT =====

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
    .map((stat) => getStatRowTemplate(stat, maxStat))
    .join("");

  document.getElementById("defensesPokemonName").textContent = pokemon.name;

  const grid = document.getElementById("typeEffectivenessGrid");
  grid.innerHTML = generateTypeEffectiveness();
}

function fillEvolutionTab(pokemon) {
  const evolutionChain = document.getElementById("evolutionChain");
  evolutionChain.innerHTML =
    '<p class="info-message">Evolution chain feature coming soon!</p>';
}

function fillMovesTab(pokemon) {
  const movesList = document.getElementById("movesList");
  const moves = pokemon.moves.slice(0, 10);

  movesList.innerHTML = moves.map((move) => getMoveItemTemplate(move)).join("");
}

function generateTypeEffectiveness() {
  const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
  ];

  return types.map((type) => getTypeEffectivenessTemplate(type)).join("");
}
