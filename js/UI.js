class UI {
  constructor() {

    // Init api 
    this.api = new API();

    // Creat makers with layerGroup
    this.markers = new L.layerGroup();

    // Init map
    this.mapa = this.initMap();

  }

  initMap() {
    // Init & get map`s property
    const map = L.map('mapa').setView([-33.43742668, -70.65007746], 10);
    const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
      }).addTo(map);
    return map;

  }

  showEstablishments() {
    this.api.getData()
      .then(data => {
        const dataResults = data.jsonResponse.data;
        //Exec function for show pins
        this.showPins(dataResults);
      });
  }

  showPins(dataResults) {
    //Clean markes 
    this.markers.clearLayers();

    //maping the stablishments
    dataResults.forEach(data => {
      const { ubicacion, direccion_calle, direccion_numero, precios, distribuidor, nombre_comuna, servicios } = data;

      const iDrugstore = !servicios.farmacia ? 'block text-secondary' : 'block text-primary';
      const iMaintenance = !servicios.mantencion ? 'block text-secondary' : 'block text-primary';
      const istore = !servicios.tienda ? 'block text-secondary' : 'block text-primary';
      const iautoServ = !servicios.autoservicio ? 'block text-secondary' : 'block text-primary';

      //Create popup
      const popupOptions = L.popup().setContent(`
        <img src="${distribuidor.logo}" width="100" class="img-thumbnail img-fluid">
        <p>${direccion_calle} #${direccion_numero}, ${nombre_comuna}</p>

        <div class="d-flex flex-row justify-content-around mb-2">
        
          <span  data-toggle="tooltip" data-placement="top" title="Farmacia"><i class="fas fa-prescription-bottle-alt d-${iDrugstore}" ></i>
          </span>

          <span data-toggle="tooltip" data-placement="top" title="Mantención"><i class="fas fa-tools d-${iMaintenance}"></i>
          </span>
          <span data-toggle="tooltip" data-placement="top" title="Autoservicio"><i class="fas fa-gas-pump d-${iautoServ}"></i>
          </span>
          <span data-toggle="tooltip" data-placement="top" title="Tienda"><i class="fas fa-store d-${istore}"></i>
          </span> 

        </div>

        <table class="table">
          <thead>
            <tr>
              <th scope="col">Combustible</th>
              <th scope="col">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gasolina 93:</td>
              <td>$${precios['gasolina 93']}</td>
            </tr>
            <tr>
              <td>Gasolina 95:</td>
              <td>$${precios['gasolina 95']}</td>
            </tr>
            <tr>
              <td>Gasolina 97:</td>
              <td>$${precios['gasolina 97']}</td>
            </tr>
            <tr>
              <td>Petróleo Diesel:</td>
              <td>$${precios['petroleo diesel']}</td>
            </tr>
            
          </tbody>
        </table>
      `);

      // Add pin
      const marker = new L.marker([
        parseFloat(ubicacion.latitud),
        parseFloat(ubicacion.longitud),
      ]).bindPopup(popupOptions);

      // Adding markers to Layer of markers
      this.markers.addLayer(marker);
    });
    // adding markers to the map
    this.markers.addTo(this.mapa);
  }

  //Searcher
  getSuggestions(searchTerm) {
    this.api.getData()
      .then(data => {
        // Get data
        const jsonResponse = data.jsonResponse.data;

        // Send the json and search term  to filter
        this.suggestionFilter(jsonResponse, searchTerm);
      });
  }

  // Filter suggestions based on input
  suggestionFilter(jsonResponse, searchTerm) {
    const filter = jsonResponse.filter(filter => filter.direccion_calle.indexOf(searchTerm) !== -1);
    this.showPins(filter);
  }
}