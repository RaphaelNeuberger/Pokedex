function onloadFunc() {
  console.log("test");
  loadData("/name");
}

const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";

async function loadData(path = "") {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

async function postData(path = "") {}
