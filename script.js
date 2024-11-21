const baseURL = window.location.hostname === "localhost"
    ? "" 
    : "https://risekk37.github.io/Data_Viz_Kitae_Jaejun/";
    
    const map = new maplibregl.Map({
        container: 'map',
        style: `${baseURL}/positron.json`, // Replace with your MapLibre style URL
        center: [-90.3070003, 40.2892984],
        zoom: 4
    });
    
    const geojsonUrl = `${baseURL}/Unit.geojson`;
    
    // Initialize Three.js renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);
    
    // Set up Three.js scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    
    map.on('load', async () => {
        // Load GeoJSON data
        const response = await fetch(geojsonUrl);
        const geojson = await response.json();
    
        const coneGeometry = new THREE.ConeGeometry(0.01, 1, 32); // Base size
        const material = new THREE.MeshBasicMaterial({ color: 0xff5733 });
    
        geojson.features.forEach(feature => {
            const [lng, lat] = feature.geometry.coordinates;
            const height = feature.properties.Unit; // Adjust based on the Unit value
    
            const cone = new THREE.Mesh(coneGeometry.clone(), material.clone());
            cone.scale.set(1, height, 1); // Adjust height
            cone.position.copy(projectToThreeJS(lng, lat, 0));
            scene.add(cone);
        });
    
        // Sync map and Three.js
        map.on('render', () => {
            renderer.render(scene, camera);
        });
    });
    
    // Utility: Convert GeoJSON coordinates to Three.js
    function projectToThreeJS(lng, lat, z) {
        const merc = map.project([lng, lat]);
        return new THREE.Vector3(
            merc.x / window.innerWidth * 2 - 1,
            -(merc.y / window.innerHeight * 2 - 1),
            z
        );
    }
    
    // Update Three.js renderer on resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });