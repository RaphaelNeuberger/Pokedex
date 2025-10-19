// ===== HTML TEMPLATES =====

function getPokemonCardTemplate(pokemon, isFav) {
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
         class="pokemon-image" 
         loading="lazy">
    <h2 class="pokemon-name">${pokemon.name}</h2>
    <div class="pokemon-types">
      ${getTypeBadgesTemplate(pokemon.types)}
    </div>
  `;
}

function getTypeBadgesTemplate(types) {
  return types
    .map(
      (typeInfo) =>
        `<span class="type-badge type-${typeInfo.type.name}">
        ${typeInfo.type.name}
      </span>`
    )
    .join("");
}

function getStatRowTemplate(stat, maxStat) {
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
}

function getMoveItemTemplate(move) {
  return `
    <div class="move-item">
      <span class="move-name">${move.move.name}</span>
      <span class="move-type" style="background: ${getTypeColor(
        "normal"
      )}">Normal</span>
    </div>
  `;
}

function getTypeEffectivenessTemplate(type, multiplier = "1×") {
  return `
    <div class="effectiveness-item">
      <div class="effectiveness-icon type-${type}">${type[0].toUpperCase()}</div>
      <span class="effectiveness-multiplier">${multiplier}</span>
    </div>
  `;
}

function getNoResultsTemplate() {
  return `
    <div class="no-results-message">
      <h2>😔 No Pokémon found</h2>
      <p>Try searching for another name or ID</p>
    </div>
  `;
}
