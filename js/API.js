class API {
  async getData() {
    //get data from api
    const data = await fetch('https://api.cne.cl/v3/combustibles/vehicular/estaciones?token=pA8G4pFQmc');
    // return response as json
    const jsonResponse = await data.json();
    return {
      jsonResponse
    };
  }
}