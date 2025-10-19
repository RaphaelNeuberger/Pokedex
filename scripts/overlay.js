// ===== POKEMON DETAIL OVERLAY =====

function openPokemonDetail(index) {
  currentDetailIndex = index;
  const pokemon = allLoadedPokemon[index];
  displayPokemonDetail(pokemon);
  showOverlay();
  updateNavigationButtons();
}

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

  updateAllFavoriteButtons(pokemon.id);
  attachFavoriteListener(pokemon.id);

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
