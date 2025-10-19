// ===== RENDERING FUNCTIONS =====

function renderPokemonCard(pokemon) {
  const card = createPokemonCardElement(pokemon);
  pokemonContainer.appendChild(card);
}

function createPokemonCardElement(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);
  card.innerHTML = getPokemonCardTemplate(pokemon, isFavorite(pokemon.id));

  attachCardListeners(card, pokemon);

  return card;
}

function attachCardListeners(card, pokemon) {
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
