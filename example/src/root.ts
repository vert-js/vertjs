// this file is mandatory

fetch("test/test.json")
  .then((response) => response.json())
  .then((json) => console.log(json));
