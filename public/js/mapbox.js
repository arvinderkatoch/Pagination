console.log("Hello from the client side");


export const displayMap = (locations) => {

    var map = L.map('map', { zoomControl: false,scrollWheelZoom:true});


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    
    const points = [];
    locations.forEach((loc) => {
        points.push([loc.coordinates[1], loc.coordinates[0]]);
        L.marker([loc.coordinates[1], loc.coordinates[0]])
        .addTo(map).bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, { autoClose: false })
        .openPopup();
        
     
    })
    
    const bounds = L.latLngBounds(points).pad(0.5);
    map.fitBounds(bounds);
    
}
