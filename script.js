// ===== INITIALIZATION & EVENT LISTENERS =====

function init() {
  loadFavoritesFromStorage();
  loadPokemon();
  attachEventListeners();
  initializeTabs();
}

function attachEventListeners() {
  attachSearchListeners();
  attachOverlayListeners();
  attachNavigationListeners();
}

function attachSearchListeners() {
  loadMoreButton.addEventListener("click", loadMorePokemon);
  searchButton.addEventListener("click", handleSearch);
  clearSearchButton.addEventListener("click", clearSearch);
  searchInput.addEventListener("input", handleLiveSearch);
  searchInput.addEventListener("keypress", handleSearchEnter);
}

function attachOverlayListeners() {
  closeButton.addEventListener("click", closeOverlay);
  overlayBackground.addEventListener("click", closeOverlay);
}

function attachNavigationListeners() {
  prevButton.addEventListener("click", showPreviousPokemon);
  nextButton.addEventListener("click", showNextPokemon);
}
