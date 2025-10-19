// ===== RENDERING FUNCTIONS =====

function renderPokemonCard(pokemon) {
  const card = createPokemonCardElement(pokemon);
  pokemonContainer.appendChild(card);
}

function createPokemonCardElement(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);
  card.innerHTML = getPokemonCardHTML(pokemon);

  card.addEventListener("click", (e) => {
    if (!e.target.closest(".card-favorite-button")) {
      const index = allLoadedPokemon.findIndex((p) => p.id === pokemon.id);
      openPokemonDetail(index);
    }
  });

  const favBtn = card.querySelector(".card-favorite-button");
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  });

  return card;
}

function getPokemonCardHTML(pokemon) {
  const isFav = isFavorite(pokemon.id);

  return `
    <button class="card-favorite-button ${isFav ? "favorited" : ""}" 
            data-pokemon-id="${pokemon.id}"
            aria-label="Add to favorites">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
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

function showError() {
  alert("Error loading Pokémon. Please try again.");
}
