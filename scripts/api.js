// ===== API FUNCTIONS =====

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

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
  if (!isSearching) {
    loadPokemon();
  }
}

async function renderPokemonList(pokemonList) {
  for (const pokemon of pokemonList) {
    const pokemonData = await fetchPokemonDetails(pokemon.url);
    allLoadedPokemon.push(pokemonData);
    allPokemonData.push(pokemonData);
    renderPokemonCard(pokemonData);
  }
}

async function searchCompleteDatabase(searchTerm) {
  try {
    const directResult = await searchByNameOrId(searchTerm);
    if (directResult) {
      return [directResult];
    }

    const allPokemonUrl = `${POKEMON_API_BASE}?limit=${TOTAL_POKEMON}`;
    const response = await fetch(allPokemonUrl);
    const data = await response.json();

    const matchingPokemon = data.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );

    const limitedMatches = matchingPokemon.slice(0, 20);
    const pokemonDetails = await Promise.all(
      limitedMatches.map((pokemon) => fetchPokemonDetails(pokemon.url))
    );

    return pokemonDetails;
  } catch (error) {
    console.error("Database search error:", error);
    return [];
  }
}

async function searchByNameOrId(searchTerm) {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/${searchTerm}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    return null;
  }
}
