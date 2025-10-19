// ===== LOCAL STORAGE FAVORITES =====

function loadFavoritesFromStorage() {
  const stored = localStorage.getItem("favoritePokemon");
  if (stored) {
    favoritePokemon = JSON.parse(stored);
  }
}

function saveFavoritesToStorage() {
  localStorage.setItem("favoritePokemon", JSON.stringify(favoritePokemon));
}

function toggleFavorite(pokemonId) {
  const index = favoritePokemon.indexOf(pokemonId);

  if (index > -1) {
    favoritePokemon.splice(index, 1);
  } else {
    favoritePokemon.push(pokemonId);
  }

  saveFavoritesToStorage();
  updateAllFavoriteButtons(pokemonId);
}

function isFavorite(pokemonId) {
  return favoritePokemon.includes(pokemonId);
}

function updateAllFavoriteButtons(pokemonId) {
  updateOverlayFavoriteButton(pokemonId);
  updateCardFavoriteButton(pokemonId);
}

function updateOverlayFavoriteButton(pokemonId) {
  const btn = document.getElementById("favoriteButton");
  if (!btn) return;

  if (isFavorite(pokemonId)) {
    btn.classList.add("favorited");
  } else {
    btn.classList.remove("favorited");
  }
}

function updateCardFavoriteButton(pokemonId) {
  const btn = document.querySelector(`[data-pokemon-id="${pokemonId}"]`);
  if (!btn) return;

  if (isFavorite(pokemonId)) {
    btn.classList.add("favorited");
  } else {
    btn.classList.remove("favorited");
  }
}
