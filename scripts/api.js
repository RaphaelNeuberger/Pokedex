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

    await fetchAllPokemonData(data.results);
    currentOffset += LIMIT;
  } catch (error) {
    console.error("Error loading Pokemon:", error);
    showError();
  } finally {
    showLoading(false);
    disableLoadButton(false);
  }
}

async function fetchAllPokemonData(pokemonList) {
  const promises = pokemonList.map((pokemon) =>
    fetchPokemonDetails(pokemon.url)
  );
  const pokemonDataArray = await Promise.all(promises);

  pokemonDataArray.forEach((pokemonData) => {
    allLoadedPokemon.push(pokemonData);
    allPokemonData.push(pokemonData);
    renderPokemonCard(pokemonData);
  });
}

function loadMorePokemon() {
  if (!isSearching) {
    loadPokemon();
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

async function searchCompleteDatabase(searchTerm) {
  try {
    const directResult = await searchByNameOrId(searchTerm);
    if (directResult) return [directResult];

    return await searchAllPokemon(searchTerm);
  } catch (error) {
    console.error("Database search error:", error);
    return [];
  }
}

async function searchAllPokemon(searchTerm) {
  const allPokemonUrl = `${POKEMON_API_BASE}?limit=${TOTAL_POKEMON}`;
  const response = await fetch(allPokemonUrl);
  const data = await response.json();

  const matches = data.results.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );

  const limitedMatches = matches.slice(0, 20);
  const promises = limitedMatches.map((p) => fetchPokemonDetails(p.url));

  return await Promise.all(promises);
}
