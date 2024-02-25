import "./style.css";

fetch("test/test.json")
  .then((response) => response.json())
  .then((json) => console.log(json));
