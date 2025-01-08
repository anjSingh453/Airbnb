mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: "map",
style: "mapbox://styles/mapbox/streets-v12", 
// center: [74.054111,15.325556],
center: coordinates,
zoom: 9,
});
  console.log(coordinates);


  const marker = new mapboxgl.Marker({color :"red"})
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({offset :25})
  .setHTML("<h1>helllo</h1>"))
  .addTo(map);
