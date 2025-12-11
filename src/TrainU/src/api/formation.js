fetch("http://localhost:8080/formation")
  .then(res => res.json())
  .then(data => console.log("Toutes les formations :", data))
  .catch(err => console.error(err));