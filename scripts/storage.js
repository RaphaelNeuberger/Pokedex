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
  const overlayFavoriteBtn = document.getElementById("favoriteButton");
  if (overlayFavoriteBtn) {
    if (isFavorite(pokemonId)) {
      overlayFavoriteBtn.classList.add("favorited");
    } else {
      overlayFavoriteBtn.classList.remove("favorited");
    }
  }

  const cardFavoriteBtn = document.querySelector(
    `[data-pokemon-id="${pokemonId}"]`
  );
  if (cardFavoriteBtn) {
    if (isFavorite(pokemonId)) {
      cardFavoriteBtn.classList.add("favorited");
    } else {
      cardFavoriteBtn.classList.remove("favorited");
    }
  }
}
