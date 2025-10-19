// ===== SEARCH FUNCTIONALITY =====

function handleLiveSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm.length === 0) {
    clearSearch();
    return;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchTerm.length >= 3) {
      performSearch(searchTerm);
    }
  }, 500);
}

async function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm.length < 3) {
    alert("Please enter at least 3 characters");
    return;
  }

  await performSearch(searchTerm);
}

function handleSearchEnter(event) {
  if (event.key === "Enter") {
    handleSearch();
  }
}

async function performSearch(searchTerm) {
  isSearching = true;
  showLoading(true);
  clearSearchButton.classList.remove("hidden");

  try {
    const localResults = filterLocalPokemon(searchTerm);

    if (localResults.length > 0) {
      displayFilteredResults(localResults);
      showLoading(false);
      return;
    }

    const apiResults = await searchCompleteDatabase(searchTerm);
    displaySearchResults(apiResults);
  } catch (error) {
    console.error("Search error:", error);
    showNoResultsMessage();
  } finally {
    showLoading(false);
  }
}

function filterLocalPokemon(searchTerm) {
  return allPokemonData.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);
    const idMatch = pokemon.id.toString().includes(searchTerm);
    return nameMatch || idMatch;
  });
}

function displaySearchResults(results) {
  if (results.length > 0) {
    displayFilteredResults(results);
  } else {
    showNoResultsMessage();
  }
}

function displayFilteredResults(filteredPokemon) {
  pokemonContainer.innerHTML = "";

  if (filteredPokemon.length === 0) {
    showNoResultsMessage();
    return;
  }

  allLoadedPokemon = filteredPokemon;
  filteredPokemon.forEach((pokemon) => renderPokemonCard(pokemon));

  loadMoreButton.style.display = "none";
}

function showNoResultsMessage() {
  pokemonContainer.innerHTML = getNoResultsTemplate();
  loadMoreButton.style.display = "none";
}

function clearSearch() {
  isSearching = false;
  searchInput.value = "";
  clearSearchButton.classList.add("hidden");
  pokemonContainer.innerHTML = "";

  allLoadedPokemon = [...allPokemonData];
  allPokemonData.forEach((pokemon) => renderPokemonCard(pokemon));

  loadMoreButton.style.display = "block";
}
