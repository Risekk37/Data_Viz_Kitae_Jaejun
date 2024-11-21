const baseURL = window.location.hostname === "localhost"
    ? "" 
    : "https://risekk37.github.io/Data_Viz_Kitae_Jaejun/";
    
const map1 = new maplibregl.Map({
        container: 'map1',
        style: `${baseURL}/positron.json`,
        center: [-90.3070003, 40.2892984],
        zoom: 4,
        scrollZoom: false,
        dragPan: false
    });