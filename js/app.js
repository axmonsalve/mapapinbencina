const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
  ui.showEstablishments();
});

//Enable search estalbishment
const search = document.querySelector('#buscar input');
search.addEventListener('input', () => {
  if (search.value.length > 4) {
    // Search in api
    ui.getSuggestions(search.value);
  } else {
    ui.showEstablishments();
  }
});