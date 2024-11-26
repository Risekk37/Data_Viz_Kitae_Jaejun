// JavaScript to toggle sidebar visibility
document.getElementById("toggle-btn").addEventListener("click", function() {
    const sidebar = document.getElementById("sidebar");

    // Toggle the 'hidden' class on sidebar
    sidebar.classList.toggle("hidden");

    // Check if sidebar is hidden or not
    if (sidebar.classList.contains("hidden")) {
        // When sidebar is hidden, move the button to the left
        this.style.left = '0';
    } else {
        // When sidebar is open, move the button to the right side of the sidebar
        this.style.left = 'calc(30% + 40px)';
    }
});

// Initialize the MapLibre map
const map = new maplibregl.Map({
    container: 'map', // The id of the HTML element to use for the map
    style: 'positron_D.json', // Path to the Maputnik style JSON
    center: [-74.135242, 40.730610], // Initial center [lng, lat]
    zoom: 9.8, // Initial zoom level
    minZoom: 9.5, // Minimum zoom level
    maxZoom: 13, // Maximum zoom level
    maxBounds: [
        [-74.835242, 40.230610], // Southwest corner [longitude, latitude]
        [-73.035242, 41.230610] // Northeast corner [longitude, latitude]
    ] // Restrict map to the boundaries of New York City
});

map.addControl(new maplibregl.NavigationControl(), 'top-left');

// Hide all map layers
function hideAllLayers() {
    map.removeLayer('Amazon_Loc');
    map.removeLayer('geojson-layer');
    map.removeLayer('geojson-outline');
    // Add any other layers you want to hide here
}

// Helper function to compute centroids of polygons (MultiPolygon support)
function computeCentroid(polygon) {
    const coords = polygon.geometry.coordinates[0][0]; // Use first ring of first polygon
    const n = coords.length;

    let x = 0, y = 0;
    coords.forEach(([lon, lat]) => {
        x += lon;
        y += lat;
    });

    return [x / n, y / n];
}
// Function to define and add the Amazon layer to the map
function defineAmazonLayer() {
    fetch('Amazon_Location.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            map.addSource('Amazon', {
                type: 'geojson',
                data: geojsonData
            });

            // Add a base fill layer (invisible) for Amazon location
            map.addLayer({
                id: 'Amazon_Loc',
                type: 'circle',
                source: 'Amazon',
                paint: {
                    'circle-radius': 10,            // Circle size
                    'circle-color': 'rgba(0, 0, 0, 0)',  // Transparent fill
                    'circle-stroke-width': 2,        // Increased border width for visibility
                    'circle-stroke-color': '#ff0000',  // Set border color to red
                    'circle-opacity': 1,
                    'circle-stroke-opacity': 1       // Full opacity for border
                }
            });
        });
}fetch('Amazon_Location.geojson')
.then(response => response.json())
.catch(error => console.error('Error loading GeoJSON:', error));
// Helper function to create a triangle path with fixed base and dynamic height
function createTrianglePath(unit) {
    const base = 10; // Fixed base size
    const height = Math.pow(unit, 2) * 2; // Dynamic height based on the unit value

    return `M ${-base / 2} 0 L ${base / 2} 0 L 0 ${-height} Z`;
}

map.on('load', () => {
    fetch('Unit_F.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            // Add GeoJSON layers to the map
            map.addSource('geojson-data', {
                type: 'geojson',
                data: geojsonData
            });

            // Add a base fill layer (invisible)
            map.addLayer({
                id: 'geojson-layer',
                type: 'fill',
                source: 'geojson-data',
                paint: {
                    'fill-color': 'transparent',
                    'fill-opacity': 0
                }
            });

            // Add an outline layer for highlighting polygons
            map.addLayer({
                id: 'geojson-outline',
                type: 'line',
                source: 'geojson-data',
                paint: {
                    'line-color': '#ff0000',
                    'line-opacity': 0, // Initially hidden
                    'line-width': 2
                },
                filter: ['==', 'id', ''] // Filter to show no polygons initially
            });

            // Create an SVG overlay for the triangles
            const svg = d3.select(map.getCanvasContainer())
                .append("svg")
                .attr("class", "overlay")
                .attr("width", "100%")
                .attr("height", "100%")
                .style("position", "absolute")
                .style("top", 0)
                .style("left", 0)
                .style("display", "none");

            // Define gradients
            const defs = svg.append("defs");

            // Default gradient (red)
            const defaultGradient = defs.append("linearGradient")
                .attr("id", "default-gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            defaultGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "red")
                .attr("stop-opacity", 1);

            defaultGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "red")
                .attr("stop-opacity", 0);

            // Clicked gradient (blue)
            const clickedGradient = defs.append("linearGradient")
                .attr("id", "clicked-gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            clickedGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "blue") // Change to desired color
                .attr("stop-opacity", 1);

            clickedGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "blue") // Change to desired color
                .attr("stop-opacity", 0);

            // Draw triangles for all polygons
            const features = geojsonData.features;

            let selectedTriangle = null; // To keep track of the selected triangle
            let popup = null; // To keep track of the popup element

            const triangles = svg.selectAll("path")
                .data(features)
                .enter()
                .append("path")
                .attr("transform", d => {
                    const centroid = computeCentroid(d);
                    const { x, y } = map.project(centroid);
                    return `translate(${x},${y})`;
                })
                .attr("d", d => createTrianglePath(d.properties.Unit))
                .attr("fill", "url(#default-gradient)") // Default gradient fill
                .attr("stroke", "transparent")
                .attr("stroke-width", 1.5)
                .on("click", function(event, d) {
                    // Reset previously selected triangle
                    if (selectedTriangle) {
                        selectedTriangle.attr("fill", "url(#default-gradient)");
                    }

                    // Highlight the clicked polygon
                    map.setFilter('geojson-outline', ['==', 'id', d.properties.id]); // Assuming each polygon has a unique 'id'
                    map.setPaintProperty('geojson-outline', 'line-opacity', 1);

                    // Set clicked triangle as selected
                    selectedTriangle = d3.select(this);
                    selectedTriangle.attr("fill", "url(#clicked-gradient)"); // Change fill to clicked gradient

                    // Remove existing popup
                    if (popup) {
                        popup.remove();
                        popup = null;
                    }

                    // Create popup
                    const centroid = computeCentroid(d);
                    const { x, y } = map.project(centroid);

                    popup = d3.select("body")
                        .append("div")
                        .attr("class", "popup")
                        .style("position", "absolute")
                        .style("background-color", "white")
                        .style("border", "1px solid black")
                        .style("padding", "10px")
                        .style("border-radius", "5px")
                        .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
                        .style("top", `${y - 50}px`)
                        .style("left", `${x + 20}px`);

                    popup.html(`
                        <strong>Census Tract:</strong> ${d.properties["Re_Income_New_York_Specific_Counties_Geographic Area Name"]}<br>
                        <strong>Median Income:</strong> $${d.properties["Re_Income_New_York_Specific_Counties_Estimate!!Households!!Median income (dollars)"]}<br>
                        <strong>Delivery Fee Unit:</strong> ${d.properties["Re_Income_New_York_Specific_Counties_Units"]}<br>
                        <strong>Destict:</strong> ${d.properties["Destrict"]}
                    `);
                });

            // Clear selection when clicking outside triangles
            map.on('click', (e) => {
                const featuresAtPoint = map.queryRenderedFeatures(e.point, { layers: ['geojson-layer'] });

                if (featuresAtPoint.length === 0) {
                    // Reset the outline and selected triangle if no feature is clicked
                    map.setPaintProperty('geojson-outline', 'line-opacity', 0);
                    map.setFilter('geojson-outline', ['==', 'id', '']); // Reset filter

                    if (selectedTriangle) {
                        selectedTriangle.attr("fill", "url(#default-gradient)");
                        selectedTriangle = null;
                    }

                    if (popup) {
                        popup.remove();
                        popup = null;
                    }
                }
            });

            // Re-draw triangles on map move or zoom
            map.on('move', () => {
                triangles.attr("transform", d => {
                    const centroid = computeCentroid(d);
                    const { x, y } = map.project(centroid);
                    return `translate(${x},${y})`;
                });
            });
         
            
            const path = d3.geoPath();  // No need to redefine this inside the listener

            let isBoroughActive = false;

            function hideAllContents() {
                document.getElementById("content-title").textContent = "";
                document.getElementById("content-text").textContent = "";
                d3.select(".overlay").style("display", "none");
            }
           
// Button click event listeners for changing content
document.getElementById("btn1").addEventListener("click", function() {
    hideAllContents();
    document.getElementById("content-title").textContent = "Delivery Fee";
    document.getElementById("content-text").textContent = "This section will display information about delivery fees.";
    d3.select(".overlay").style("display", "block");
});
document.getElementById("btn2").addEventListener("click", function() {
    hideAllContents();
    d3.select(".overlay").style("display", "block");
    isBoroughActive = !isBoroughActive;
    
    // Update triangle colors based on the `Destrict` property
    triangles.attr("fill", d => {
        if (isBoroughActive) {
            const borough = d.properties["Destrict"];
            
            // Return the corresponding gradient for each borough
            return borough === 1 ? "url(#borough-gradient-1)" :
                   borough === 2 ? "url(#borough-gradient-2)" :
                   borough === 3 ? "url(#borough-gradient-3)" :
                   borough === 4 ? "url(#borough-gradient-4)" :
                   "url(#default-gradient)"; // Default gradient for other boroughs
        } else {
            return "url(#default-gradient)"; // Default gradient when borough is not active
        }
    });

    // Handle Destrict.geojson layer visibility
    if (isBoroughActive) {
        fetch('Destrict.geojson')
        .then(response => response.json())
        .then(boroughData => {
            map.addSource('borough-data', {
                type: 'geojson',
                data: boroughData
            });
    
            // Add a fill layer with color based on the 'Destrict' property
            map.addLayer({
                id: 'borough-fill',
                type: 'fill',
                source: 'borough-data',
                paint: {
                    'fill-color': [
                        'match', 
                        ['get', 'Destrict'], 
                        1, '#cc0000', // Replace 'value1' with actual values from your 'Destrict' field
                        2, '#1f3d99', // Replace 'value2' with another value
                        3, '#ffff53',
                        4, '#a1661a',  // And so on, for each distinct 'Destrict' value
                        '#808080' // Default color for values not matched
                    ],
                    'fill-opacity': 0.1 // Adjust the fill opacity as needed
                }
            });
    
            // Add a line layer for the borough outlines
            map.addLayer({
                id: 'borough-outline',
                type: 'line',
                source: 'borough-data',
                paint: {
                    'line-color': '#ffffff', // Outline color
                    'line-opacity': 0.3,
                    'line-width': 1 // Adjust the line width as needed
                }
            });
        });
        
        // Load Destrict.geojson and add MultiPolygon outline using D3
        d3.json("Destrict.geojson").then(function(geojsonData) {
            // Select and append the MultiPolygon paths with a white outline
            svg.selectAll(".destrict")
                .data(geojsonData.features)
                .enter()
                .append("path")
                .attr("class", "destrict")
                .attr("d", path) // Use geoPath to generate the path from coordinates
                .attr("fill", "none") // No fill color for the MultiPolygon
                .attr("stroke", "white") // Set the border color to white
                .attr("stroke-width", 2) // Set stroke width for visibility
                .attr("opacity", 0.5); // Set opacity to make the outline more visible
        });

    } else {
        // Remove the Destrict layer from Mapbox
        map.removeLayer('borough-fill');
        map.removeLayer('borough-outline');
        map.removeSource('borough-data');

        // Remove the SVG paths from the D3 visualization
        svg.selectAll(".destrict").remove();

        // Reset the outline opacity (if needed)
        map.setPaintProperty('geojson-outline', 'line-opacity', 0);
    }
});

// Define borough gradients for triangle color updates
const boroughGradients = defs.selectAll(".borough-gradient")
    .data([1, 2, 3, 4]) // Define borough IDs
    .enter()
    .append("linearGradient")
    .attr("class", "borough-gradient")
    .attr("id", d => `borough-gradient-${d}`)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

boroughGradients.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d => {
        // Define the color for the start of each gradient based on borough
        return d === 1 ? "blue" :
               d === 2 ? "green" :
               d === 3 ? "purple" :
               d === 4 ? "orange" : "red";
    })
    .attr("stop-opacity", 1);

boroughGradients.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d => {
        // Define the color for the end of each gradient based on borough
        return d === 1 ? "lightblue" :
               d === 2 ? "lightgreen" :
               d === 3 ? "lightpurple" :
               d === 4 ? "lightorange" : "lightred";
    })
    .attr("stop-opacity", 0);
        });
});
document.getElementById("btn3").addEventListener("click", function() {
    hideAllContents();
    document.getElementById("content-title").textContent = "Package Theft";
    document.getElementById("content-text").textContent = "This section will display information about package theft.";
    // Update table or content for this section
});