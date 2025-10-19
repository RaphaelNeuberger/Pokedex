// ===== API CONFIGURATION =====
const POKEMON_API_BASE = "https://pokeapi.co/api/v2/pokemon";
const POKEMON_SPECIES_BASE = "https://pokeapi.co/api/v2/pokemon-species";
const TOTAL_POKEMON = 1025;
const LIMIT = 20;

// ===== GLOBAL STATE =====
let currentOffset = 0;
let allLoadedPokemon = [];
let currentDetailIndex = 0;
let favoritePokemon = [];
let isSearching = false;
let allPokemonData = [];
let searchTimeout;

// ===== DOM ELEMENTS =====
const pokemonContainer = document.getElementById("pokemonContainer");
const loadMoreButton = document.getElementById("loadMoreButton");
const loadingScreen = document.getElementById("loadingScreen");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearSearchButton = document.getElementById("clearSearchButton");
const overlay = document.getElementById("pokemonOverlay");
const overlayBackground = document.getElementById("overlayBackground");
const closeButton = document.getElementById("closeButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
