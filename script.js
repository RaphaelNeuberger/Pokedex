// ===== INITIALIZATION & EVENT LISTENERS =====

function init() {
  loadFavoritesFromStorage();
  loadPokemon();
  attachEventListeners();
  initializeTabs();
}

function attachEventListeners() {
  loadMoreButton.addEventListener("click", loadMorePokemon);
  searchButton.addEventListener("click", handleSearch);
  clearSearchButton.addEventListener("click", clearSearch);
  searchInput.addEventListener("input", handleLiveSearch);
  searchInput.addEventListener("keypress", handleSearchEnter);
  closeButton.addEventListener("click", closeOverlay);
  overlayBackground.addEventListener("click", closeOverlay);
  prevButton.addEventListener("click", showPreviousPokemon);
  nextButton.addEventListener("click", showNextPokemon);
}
