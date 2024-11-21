const baseURL = window.location.hostname === "localhost" ? "" : "https://risekk37.github.io/Data_Viz_Kitae_Jaejun/";

        const map = new maplibregl.Map({
            container: 'map',
            style: `${baseURL}/positron.json`, // Replace with your MapLibre style URL
            center: [-73.935242, 40.730610],
            zoom: 10
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
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 100); // Start position of the camera

        const coneGeometry = new THREE.ConeGeometry(0.01, 1, 32); // Base size
        const material = new THREE.MeshBasicMaterial({ color: 0xff5733 });

        map.on('load', async () => {
            // Load GeoJSON data
            const response = await fetch(geojsonUrl);
            const geojson = await response.json();

            geojson.features.forEach(feature => {
                const [lng, lat] = feature.geometry.coordinates;
                const height = feature.properties.Unit / 10; // Adjust based on the Unit value

                const cone = new THREE.Mesh(coneGeometry.clone(), material.clone());
                cone.scale.set(0.01, height, 0.01); // Adjust height
                cone.position.copy(projectToThreeJS(lng, lat, 0));
                scene.add(cone);
            });

            // Sync map and Three.js
            map.on('render', () => {
                camera.position.copy(map.getCenter());
                camera.position.z = 500; // Adjust camera position for better view

                renderer.render(scene, camera);
            });
        });

        // Utility: Convert GeoJSON coordinates to Three.js
        function projectToThreeJS(lng, lat, z) {
            const merc = map.project([lng, lat]);
            // Scaling for proper 3D rendering
            const x = merc.x - window.innerWidth / 2; 
            const y = -merc.y + window.innerHeight / 2;
            return new THREE.Vector3(x, y, z);
        }

        // Update Three.js renderer on resize
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });