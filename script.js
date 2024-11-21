const baseURL = window.location.hostname === "localhost"
    ? "" 
    : "https://risekk37.github.io/GIS-for-deisng-practices_Kitea-Julia";
    
const map1 = new maplibregl.Map({
        container: 'map1',
        style: `${baseURL}/positron.json`,
        center: [-90.3070003, 40.2892984],
        zoom: 4,
        scrollZoom: false,
        dragPan: false
    });