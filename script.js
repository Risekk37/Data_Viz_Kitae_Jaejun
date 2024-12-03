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
// 메뉴 버튼 클릭 시 팝업 열기/닫기
document.getElementById("menu-btn").addEventListener("click", function () {
    const menuPopup = document.getElementById("menu-popup");
    if (menuPopup.classList.contains("hidden")) {
        menuPopup.classList.remove("hidden");
        menuPopup.style.display = "block";
    } else {
        menuPopup.classList.add("hidden");
        menuPopup.style.display = "none";
    }
});

// 버튼 클릭 시 동작 추가 (예: btn0을 기본 활성화 상태로 설정)
document.getElementById("btn0").addEventListener("click", function () {
    console.log("Project button clicked");
    // 원하는 동작 추가
});

// Initialize the MapLibre map
const map = new maplibregl.Map({
    container: 'map', // The id of the HTML element to use for the map
    style: 'positron_D.json', // Path to the Maputnik style JSON
    center: [-74.035242, 40.730610], // Initial center [lng, lat]
    zoom: 10, // Initial zoom level
    minZoom: 9.5, // Minimum zoom level
    maxZoom: 13, // Maximum zoom level
    maxBounds: [
        [-74.835242, 40.230610], // Southwest corner [longitude, latitude]
        [-73.035242, 41.230610] // Northeast corner [longitude, latitude]
    ] // Restrict map to the boundaries of New York City
});

map.addControl(new maplibregl.NavigationControl(), 'bottom-right');


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
                    'circle-radius': 1,            // Circle size
                    'circle-color': 'rgba(0, 0, 0, 1)',  // Transparent fill
                    'circle-stroke-width': 2,        // Increased border width for visibility
                    'circle-stroke-color': '#ec5d5d',  // Set border color to red
                    'circle-opacity': 0.7,
                    'circle-stroke-opacity': 0.7      // Full opacity for border
                }
            });
        });
}
function defineTraderLayer() {
    fetch('Trader_Location.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            map.addSource('Trader', {
                type: 'geojson',
                data: geojsonData
            });

            // Add a base fill layer (invisible) for Amazon location
            map.addLayer({
                id: 'Trader_Loc',
                type: 'circle',
                source: 'Trader',
                paint: {
                    'circle-radius': 1,            // Circle size
                    'circle-color': 'rgba(0, 0, 0, 1)',  // Transparent fill
                    'circle-stroke-width': 2,        // Increased border width for visibility
                    'circle-stroke-color': '#e98fbc',  // Set border color to red
                    'circle-opacity': 0.7,
                    'circle-stroke-opacity': 0.7      // Full opacity for border
                }
            });
        });
}
function defineWalmartLayer() {
    fetch('Walmart_Location.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            map.addSource('Walmart', {
                type: 'geojson',
                data: geojsonData
            });

            // Add a base fill layer (invisible) for Amazon location
            map.addLayer({
                id: 'Walmart_Loc',
                type: 'circle',
                source: 'Walmart',
                paint: {
                    'circle-radius': 1,            // Circle size
                    'circle-color': 'rgba(0, 0, 0, 1)',  // Transparent fill
                    'circle-stroke-width': 2,        // Increased border width for visibility
                    'circle-stroke-color': '#ffd461',  // Set border color to red
                    'circle-opacity': 0.7,
                    'circle-stroke-opacity': 0.7      // Full opacity for border
                }
            });
        });
}
function defineWholeLayer() {
    fetch('Whole_Food_Location.geojson')
        .then(response => response.json())
        .then(geojsonData => {
            map.addSource('Whole_Food', {
                type: 'geojson',
                data: geojsonData
            });

            // Add a base fill layer (invisible) for Amazon location
            map.addLayer({
                id: 'Whole_Loc',
                type: 'circle',
                source: 'Whole_Food',
                paint: {
                    'circle-radius': 1,            // Circle size
                    'circle-color': 'rgba(0, 0, 1, 1)',  // Transparent fill
                    'circle-stroke-width': 2,        // Increased border width for visibility
                    'circle-stroke-color': '#3dcba4',  // Set border color to red
                    'circle-opacity': 0.7,
                    'circle-stroke-opacity': 0.7      // Full opacity for border
                }
            });
        });
}
defineAmazonLayer();
defineTraderLayer();
defineWalmartLayer();
defineWholeLayer();

function definePackageLayer() {
    // 이미지 추가
    map.loadImage('package3.png', (error, image) => {
        if (error) throw error;

        // 이미지 등록
        if (!map.hasImage('package-icon')) {
            map.addImage('package-icon', image);
        }

        // 데이터 소스 추가
        map.addSource('package-source', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-74.04172287518699, 40.74969215442544], // 첫 번째 위치
                        },
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-74.01219711826798, 40.797921437587966], // 두 번째 위치
                        },
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-73.94827724606394, 40.689797835365205], // 세 번째 위치 (예: 엠파이어 스테이트 빌딩)
                        }, 
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-73.97785244138562, 40.78405099270973], // 세 번째 위치 (예: 엠파이어 스테이트 빌딩)
                        },  
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-73.89987784823322, 40.82074299748267], // 세 번째 위치 (예: 엠파이어 스테이트 빌딩)
                        },   
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-73.91080380585716, 40.89295396819356], // 세 번째 위치 (예: 엠파이어 스테이트 빌딩)
                        },   
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-73.99478754903049, 40.629954952226534], // 세 번째 위치 (예: 엠파이어 스테이트 빌딩)
                        },    
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-74.10502365040031, 40.62701123818052], // 세 번째 위치 (예: 엠파이어 스테이트 빌딩)
                        },    
                    },
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [-74.16558237954096,40.549271012607555], // 세 번째 위치 (예: 엠파이어 스테이트 빌딩)
                        },     
                    },
                ],
            }, 
        });

        // 레이어 추가
        map.addLayer({
            id: 'package-layer',
            type: 'symbol',
            source: 'package-source',
            layout: {
                'icon-image': 'package-icon',
                'icon-size': 0.03, // 기본 크기
            },
        });

        packageLayerVisible = true;

        // 줌 이벤트로 크기 조정
        map.on('zoom', () => {
            const zoom = map.getZoom();
            const size = zoom / 300; // 줌 비율에 따라 크기 조정
            map.setLayoutProperty('package-layer', 'icon-size', size);
        });
    });
}

definePackageLayer();
                       // CSV 데이터를 직접 정의
                       const rawData = [
                        { Unit: "Amazon", Year: "139.00", Month: "14.99", Order: "4.99" },
                        { Unit: "Amazon_Fresh", Year: "139.00", Month: "14.99", Order: "9.95" },
                        { Unit: "Whole_food", Year: "0.00", Month: "14.99", Order: "9.95" },
                        { Unit: "Instacart", Year: "99.00", Month: "9.99", Order: "7.99" },
                        { Unit: "Target", Year: "99.00", Month: "10.99", Order: "10.99" },
                        { Unit: "Walmart", Year: "98.00", Month: "12.95", Order: "9.95" },
                        { Unit: "UberEats", Year: "119.99", Month: "9.99", Order: "3.99" },
                        { Unit: "Doordash", Year: "96.00", Month: "9.99", Order: "5.00" },
                        { Unit: "Grubhub", Year: "119.00", Month: "9.99", Order: "4.00" },
                    ];
                    
                    function processCSV(data) {
                        return data.map(d => ({
                            service: d.Unit,
                            Year: +d.Year,
                            Month: +d.Month,
                            Order: +d.Order,
                        }));
                    }
                    
                    function createBarChart(data, container) {
                        const processedData = processCSV(data);
                        const margin = { top: 20, right: 30, bottom: 60, left: 50 };
                        const width = 450 - margin.left - margin.right;
                        const height = 400 - margin.top - margin.bottom;
                    
                        d3.select(container).selectAll("*").remove();
                    
                        const svg = d3
                            .select(container)
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);
                    
                        const x0 = d3
                            .scaleBand()
                            .domain(processedData.map(d => d.service))
                            .range([0, width])
                            .padding(0.2);
                    
                        const x1 = d3
                            .scaleBand()
                            .domain(["Year", "Month", "Order"])
                            .range([0, x0.bandwidth()])
                            .padding(0.05);
                    
                        const y = d3
                            .scaleLinear()
                            .domain([0, d3.max(processedData, d => Math.max(d.Year, d.Month, d.Order))])
                            .nice()
                            .range([height, 0]);
                    
                        const colors = {
                            Year: "#8D9AAC",
                            Month: "#556580",
                            Order: "#1D3459",
                        };
                    
                        svg.append("g")
                            .attr("transform", `translate(0,${height})`)
                            .call(d3.axisBottom(x0))
                            .selectAll("text")
                            .style("text-anchor", "end")
                            .attr("dx", "-0.8em")
                            .attr("dy", "0.15em")
                            .attr("transform", "rotate(-45)");
                    
                        svg.append("g").call(d3.axisLeft(y));
                    
                        const bars = svg
                            .selectAll("g.bar-group")
                            .data(processedData)
                            .enter()
                            .append("g")
                            .attr("class", "bar-group")
                            .attr("transform", d => `translate(${x0(d.service)},0)`);
                    
                        bars.selectAll("rect")
                            .data(d =>
                                ["Year", "Month", "Order"].map(key => ({ key, value: d[key] }))
                            )
                            .enter()
                            .append("rect")
                            .attr("x", d => x1(d.key))
                            .attr("y", d => y(d.value))
                            .attr("width", x1.bandwidth())
                            .attr("height", d => height - y(d.value))
                            .attr("fill", d => colors[d.key]);
                    // X축 라벨 추가
                    svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", height + 60) // X축 아래 여백 추가
                    .attr("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .text("Delivery Service");
                    
                    svg.append("text")
                    .attr("class", "y-axis-label")
                    .attr("transform", "rotate(-90)") // -90도 회전
                    .attr("x", -height / 2) // 중앙 정렬
                    .attr("y", -margin.left + 10) // 여백 조정
                    .attr("text-anchor", "middle") // 텍스트 정렬
                    .attr("font-size", "12px")
                    .text("Service Fee");
                    
                    // Tooltip 추가
                    const tooltip = svg.append("g")
                        .style("opacity", 0)
                        .attr("class", "tooltip");
                    
                    tooltip.append("rect")
                        .attr("width", 100)
                        .attr("height", 30)
                        .attr("fill", "rgb(255,255,255,0.5)")
                        .attr("stroke", "rgb(0, 45, 143,0.5)");
                    
                    tooltip.append("text")
                        .attr("x", 10)
                        .attr("y", 20)
                        .style("font-size", "12px");
                    
                    bars.selectAll("rect")
                        .on("mouseover", function(event, d) {
                            tooltip.style("opacity", 1);
                    
                            // Tooltip에 표시할 내용
                            tooltip.select("text").text(`${d.key}: $${d.value}`);
                        })
                        .on("mousemove", function(event) {
                            tooltip
                                // Tooltip을 마우스 오른쪽에 10px 정도 떨어지도록 설정
                                .attr("transform", `translate(${event.pageX -90}, ${event.pageY - 170})`);
                        })
                        .on("mouseout", function() {
                            tooltip.style("opacity", 0);
                        });
                    
                        const legend = svg
                            .append("g")
                            .attr("transform", `translate(${width - 22}, -15)`);
                    
                        Object.keys(colors).forEach((key, i) => {
                            legend
                                .append("rect")
                                .attr("x", 0)
                                .attr("y", i * 20)
                                .attr("width", 10)
                                .attr("height", 10)
                                .attr("fill", colors[key]);
                    
                            legend
                                .append("text")
                                .attr("x", 15)
                                .attr("y", i * 20 + 6)
                                .text(key)
                                .style("font-size", "12px")
                                .attr("alignment-baseline", "middle");
                        });
                    }
                    const container = "#table-container";
                    createBarChart(rawData, container);
                    
                    const rawData2 = [
                        { x: 1, y: 23 },
                        { x: 2, y: 293 },
                        { x: 3, y: 218 },
                        { x: 4, y: 120 },
                        { x: 5, y: 43 },
                        { x: 6, y: 21 },
                        { x: 7, y: 12 },
                        { x: 8, y: 10 },
                        { x: 9, y: 20 },
                        { x: 10, y: 16 }
                    ];
                    function createLineChart(rawData2, container) {
                        // 컨테이너 크기 설정
                        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
                        const width = 450 - margin.left - margin.right;
                        const height = 400 - margin.top - margin.bottom;
                    
                        // SVG 요소 추가
                        const svg = d3.select(container)
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`);
                    
                        // X, Y 스케일 설정
                        const x = d3.scaleLinear()
                            .domain([1, d3.max(rawData2, d => d.x)]) // X축은 1부터 최대값까지
                            .range([0, width]);
                    
                        const y = d3.scaleLinear()
                            .domain([0, d3.max(rawData2, d => d.y)])  // Y축 최대값은 데이터에서 가장 큰 값
                            .range([height, 0]);
                    
                        // X축, Y축 추가
                        svg.append("g")
                            .attr("transform", `translate(0,${height})`)
                            .call(d3.axisBottom(x));
                    
                        svg.append("g")
                            .call(d3.axisLeft(y));
                    
                        // X축 라벨 추가
                        svg.append("text")
                        .attr("x", width / 2)
                        .attr("y", height + 35) // X축 아래 여백 추가
                        .attr("text-anchor", "middle")
                        .attr("font-size", "12px")
                        .text("Unit");
                    
                        svg.append("text")
                        .attr("class", "y-axis-label")
                        .attr("transform", "rotate(-90)") // -90도 회전
                        .attr("x", -height / 2) // 중앙 정렬
                        .attr("y", -margin.left + 10) // 여백 조정
                        .attr("text-anchor", "middle") // 텍스트 정렬
                        .attr("font-size", "12px")
                        .text("Borough number");
                    
                        // 선분 그리기
                        const line = d3.line()
                            .x(d => x(d.x))
                            .y(d => y(d.y));
                    
                        svg.append("path")
                            .data([rawData2])  // rawData2로 변경
                            .attr("class", "line")
                            .attr("d", line)
                            .attr("fill", "none")
                            .attr("stroke", "orange")
                            .attr("stroke-width", 2);
                    
                        // 선분 밑에 빨간색 색을 채우기 (y=0 부터 선분까지 채우기)
                        const area = d3.area()
                            .x(d => x(d.x))
                            .y0(height)  // y0를 0 (x축)으로 설정
                            .y1(d => y(d.y));  // 선분의 y값을 채우기
                    
                        svg.append("path")
                            .data([rawData2])  // rawData2로 변경
                            .attr("class", "area")
                            .attr("d", area)
                            .attr("fill", "url(#orange-gradient)")  // 그라데이션을 채우기 위해 url을 사용
                            .attr("fill-opacity", 1);  // 투명도 100%
                    
                        // 그라데이션 정의
                        const gradient = svg.append("defs")
                            .append("linearGradient")
                            .attr("id", "orange-gradient")
                            .attr("x1", "0%")
                            .attr("y1", "0%")
                            .attr("x2", "100%")
                            .attr("y2", "0%");
                    
                        gradient.append("stop")
                            .attr("offset", "0%")
                            .attr("stop-color", "white")  // x=0일 때는 흰색(투명도)
                            .attr("stop-opacity", 0);  // x=0일 때는 완전히 투명
                    
                        gradient.append("stop")
                            .attr("offset", "100%")
                            .attr("stop-color", "orange")  // x가 커질수록 빨간색
                            .attr("stop-opacity", 1);  // x가 최대일 때는 빨간색이 100%
                    
                        // 각 데이터 포인트에서 x축부터 y값까지 세로 점선 추가
                        svg.selectAll(".vertical-line")
                            .data(rawData2)
                            .enter()
                            .append("line")
                            .attr("class", "vertical-line")
                            .attr("x1", d => x(d.x))
                            .attr("y1", height)  // x축 위치
                            .attr("x2", d => x(d.x))
                            .attr("y2", d => y(d.y))  // 각 y값까지 세로선 그리기
                            .attr("stroke", "red")
                            .attr("stroke-dasharray", "1 4")  // 점선 스타일
                            .attr("stroke-width", 1)
                            .attr("stroke-opacity", 0.5);  // 점선 투명도 50%
                            
                            svg.append("text")
                            .attr("x", width) // 오른쪽 여백
                            .attr("y", 10) // 위쪽 여백
                            .attr("text-anchor", "end") // 오른쪽 정렬
                            .attr("font-size", "12px")
                            .style("font-weight", "bold") // 굵게 설정
                            .style("font-style", "italic") // 이탤릭 설정
                            .style("fill", "rgba(0, 45, 143, 0.7)") // 색상 설정
                            .text("Unit Number more than 4: 31.7%"); // 표시할 텍스트
                        }
                        
                        const rawData3 = [
                            ['Not at all', 13],
                            ['Moderately', 59],
                            ['Extremely', 28]
                        ];
                        
                        function createBarChart_Package(rawData, container) {
                            // Prepare the data for the bar chart
                            const data = rawData.map(d => ({
                                category: d[0], // Category name
                                value: d[1]     // Corresponding value
                            }));
                        
                            // Set up margins and dimensions for the chart
                            const margin = { top: 20, right: 30, bottom: 20, left: 50 };
                            const width = 450 - margin.left - margin.right;
                            const height = 140 - margin.top - margin.bottom;
                        
                            // Clear any previous content
                            d3.select(container).selectAll("*").remove();
                        
                            // Create an SVG element
                            const svg = d3
                                .select(container)
                                .append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                                .append("g")
                                .attr("transform", `translate(${margin.left},${margin.top})`);
                        
                            // Set up the x and y scales
                            const x = d3.scaleLinear()
                                .domain([0, d3.max(data, d => d.value)]) // Ensure that x-axis spans from 0 to the max value
                                .range([0, width]);
                        
                            const y = d3.scaleBand()
                                .domain(data.map(d => d.category))
                                .range([0, height])
                                .padding(0.1);
                        
                          
                            // Add background bars for the chart (behind the actual bars)
                            svg.selectAll(".background-bar")
                            .data(data)
                            .enter()
                            .append("rect")
                            .attr("class", "background-bar")
                            .attr("x", 0) // Background bars start from the left
                            .attr("y", d => y(d.category)) // Position based on the category
                            .attr("width", width) // Set the width to match the x-axis length
                            .attr("height", y.bandwidth()) // Match the height of the categories
                            .attr("fill", "#8D9AAC"); // Set a light gray color for the background

                            // Create bars for the chart
                            svg.selectAll(".bar")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", 0) // Bars start from the left
                                .attr("y", d => y(d.category)) // Position based on the category
                                .attr("width", d => x(d.value)) // Set the bar width based on the value
                                .attr("height", y.bandwidth()) // Reduce the bar height by 1/3
                                .attr("fill", "#556580"); // Set bar color
                        
                            // Add tooltip functionality
                            const tooltip = svg.append("g")
                                .style("opacity", 0)
                                .attr("class", "tooltip");
                        
                            tooltip.append("rect")
                                .attr("width", 100)
                                .attr("height", 30)
                                .attr("fill", "rgb(255,255,255,0.5)")
                                .attr("stroke", "rgb(0, 45, 143,0.5)");
                        
                            svg.selectAll(".bar")
                                .on("mouseover", function(event, d) {
                                    tooltip.style("opacity", 1);
                                    tooltip.select("text").text(`${d.category}: ${d.value}`);
                                })
                                .on("mousemove", function(event) {
                                    tooltip
                                        .attr("transform", `translate(${event.pageX - 90}, ${event.pageY - 30})`);
                                })
                                .on("mouseout", function() {
                                    tooltip.style("opacity", 0);
                                });
                        
                            // Add labels to the bars (category names)
                            svg.selectAll(".bar-label")
                                .data(data)
                                .enter()
                                .append("text")
                                .attr("class", "bar-label")
                                .attr("x", 5) // Position the category label to the left of the bar
                                .attr("y", d => y(d.category) + y.bandwidth() / 3 + 5) // Adjust the y to place text on top of the bar
                                .attr("dy", ".35em") // Vertical alignment
                                .attr("text-anchor", "start") // Align text to the left of the bar
                                .attr("fill", "rgb(255,255,255,0.8)")
                                .style("font-size", "10px")
                                .text(d => d.category);
                                
                        
                                svg.selectAll(".value-label")
                                .data(data)
                                .enter()
                                .append("text")
                                .attr("class", "value-label")
                                .attr("x", width-5) // Set the x position to the right end of the background bar (end of the SVG)
                                .attr("y", d => y(d.category) + y.bandwidth() / 3 + 5) // Adjust the y to place text on top of the bar
                                .attr("dy", ".35em") // Vertical alignment
                                .attr("text-anchor", "end") // Align text to the right end of the background bar
                                .attr("fill", "rgb(255,255,255,0.8)")
                                .style("font-size", "12px")
                                .text(d => `${d.value}%`); // Add "%" symbol to the value
                                 }
                              
                        const rawData4 = [
                            [1, 34],
                            [2, 39],
                            [3, 15],
                            [4, 4],
                            ['5+', 8]
                        ];
                        
                        function createBarChart_Package2(rawData, container) {
                            // Prepare the data for the bar chart
                            const data = rawData.map(d => ({
                                category: d[0], // Category name
                                value: d[1]     // Corresponding value
                            }));
                        
                            // Set up margins and dimensions for the chart
                            const margin = { top: 20, right: 30, bottom: 20, left: 50 };
                            const width = 450 - margin.left - margin.right;
                            const height = 200 - margin.top - margin.bottom;
                        
                            // Clear any previous content
                            d3.select(container).selectAll("*").remove();
                        
                            // Create an SVG element
                            const svg = d3
                                .select(container)
                                .append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                                .append("g")
                                .attr("transform", `translate(${margin.left},${margin.top})`);
                        
                            // Set up the x and y scales
                            const x = d3.scaleLinear()
                                .domain([0, d3.max(data, d => d.value)]) // Ensure that x-axis spans from 0 to the max value
                                .range([0, width]);
                        
                            const y = d3.scaleBand()
                                .domain(data.map(d => d.category))
                                .range([0, height])
                                .padding(0.1);
                        
                            // Create a background bar for each category to align images
                            svg.selectAll(".background-bar")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "background-bar")
                                .attr("x", 0)
                                .attr("y", d => y(d.category)) // Position based on the category
                                .attr("width", width) // Set the width of the background bar to the full width
                                .attr("height", y.bandwidth()) // Height of the background bar matches the category height
                                .attr("fill", "#8D9AAC"); // Light grey color for background bar
                        
                            // Create bars for the chart
                            svg.selectAll(".bar")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", 0) // Bars start from the left
                                .attr("y", d => y(d.category)) // Position based on the category
                                .attr("width", d => x(d.value)) // Set the bar width based on the value
                                .attr("height", y.bandwidth()) // Set the bar height
                                .attr("fill", "#556580"); // Set bar color
                        
                            // Add tooltip functionality
                            const tooltip = svg.append("g")
                                .style("opacity", 0)
                                .attr("class", "tooltip");
                        
                            tooltip.append("rect")
                                .attr("width", 100)
                                .attr("height", 30)
                                .attr("fill", "rgb(255,255,255,0.5)")
                                .attr("stroke", "rgb(0, 45, 143,0.5)");
                        
                            svg.selectAll(".bar")
                                .on("mouseover", function(event, d) {
                                    tooltip.style("opacity", 1);
                                    tooltip.select("text").text(`${d.category}: ${d.value}`);
                                })
                                .on("mousemove", function(event) {
                                    tooltip
                                        .attr("transform", `translate(${event.pageX - 90}, ${event.pageY - 30})`);
                                })
                                .on("mouseout", function() {
                                    tooltip.style("opacity", 0);
                                });
                        
                                svg.selectAll(".bar-label")
                                .data(data)
                                .enter()
                                .append("text")
                                .attr("class", "bar-label")
                                .attr("x", 5) // Position the category label to the left of the bar
                                .attr("y", d => y(d.category) + y.bandwidth() / 3 + 5) // Adjust the y to place text on top of the bar
                                .attr("dy", ".35em") // Vertical alignment
                                .attr("text-anchor", "start") // Align text to the left of the bar
                                .attr("fill", "rgb(255,255,255,0.8)")
                                .style("font-size", "10px")
                                .text(d => d.category);
                                
                        
                                svg.selectAll(".value-label")
                                .data(data)
                                .enter()
                                .append("text")
                                .attr("class", "value-label")
                                .attr("x", width-5) // Set the x position to the right end of the background bar (end of the SVG)
                                .attr("y", d => y(d.category) + y.bandwidth() / 3 + 5) // Adjust the y to place text on top of the bar
                                .attr("dy", ".35em") // Vertical alignment
                                .attr("text-anchor", "end") // Align text to the right end of the background bar
                                .attr("fill", "rgb(255,255,255,0.8)")
                                .style("font-size", "12px")
                                .text(d => `${d.value}%`); // Add "%" symbol to the value
                                 }
                                 
                                 const rawData5 = [
                                    ['Track the Delivery Process', 52],
                                    ['Stay at home when expecting a package', 50],
                                    ['Shop in-store or online with in-store pickup', 40],
                                    ['Security system', 25],
                                    ['Had it sent to another location', 19]
                                ];
                                
                                function createBarChart_Package3(rawData, container) {
                                    // Prepare the data for the bar chart
                                    const data = rawData.map(d => ({
                                        category: d[0], // Category name
                                        value: d[1]     // Corresponding value
                                    }));
                                
                                    // Set up margins and dimensions for the chart
                                    const margin = { top: 20, right: 30, bottom: 20, left: 50 };
                                    const width = 450 - margin.left - margin.right;
                                    const height = 200 - margin.top - margin.bottom;
                                
                                    // Clear any previous content
                                    d3.select(container).selectAll("*").remove();
                                
                                    // Create an SVG element
                                    const svg = d3
                                        .select(container)
                                        .append("svg")
                                        .attr("width", width + margin.left + margin.right)
                                        .attr("height", height + margin.top + margin.bottom)
                                        .append("g")
                                        .attr("transform", `translate(${margin.left},${margin.top})`);
                                
                                    // Set up the x and y scales
                                    const x = d3.scaleLinear()
                                        .domain([0, d3.max(data, d => d.value)]) // Ensure that x-axis spans from 0 to the max value
                                        .range([0, width]);
                                
                                    const y = d3.scaleBand()
                                        .domain(data.map(d => d.category))
                                        .range([0, height])
                                        .padding(0.1);
                                
                                    // Create a background bar for each category to align images
                                    svg.selectAll(".background-bar")
                                        .data(data)
                                        .enter()
                                        .append("rect")
                                        .attr("class", "background-bar")
                                        .attr("x", 0)
                                        .attr("y", d => y(d.category)) // Position based on the category
                                        .attr("width", width) // Set the width of the background bar to the full width
                                        .attr("height", y.bandwidth()) // Height of the background bar matches the category height
                                        .attr("fill", "#8D9AAC"); // Light grey color for background bar
                                
                                    // Create bars for the chart
                                    svg.selectAll(".bar")
                                        .data(data)
                                        .enter()
                                        .append("rect")
                                        .attr("class", "bar")
                                        .attr("x", 0) // Bars start from the left
                                        .attr("y", d => y(d.category)) // Position based on the category
                                        .attr("width", d => x(d.value)) // Set the bar width based on the value
                                        .attr("height", y.bandwidth()) // Set the bar height
                                        .attr("fill", d => d.category === "Stay at home when expecting a package" ? "#1D3459" : "#556580"); // Change color for this specific category
                                
                                    // Add tooltip functionality
                                    const tooltip = svg.append("g")
                                        .style("opacity", 0)
                                        .attr("class", "tooltip");
                                
                                    tooltip.append("rect")
                                        .attr("width", 100)
                                        .attr("height", 30)
                                        .attr("fill", "rgb(255,255,255,0.5)")
                                        .attr("stroke", "rgb(0, 45, 143,0.5)");
                                
                                    svg.selectAll(".bar")
                                        .on("mouseover", function(event, d) {
                                            tooltip.style("opacity", 1);
                                            tooltip.select("text").text(`${d.category}: ${d.value}`);
                                        })
                                        .on("mousemove", function(event) {
                                            tooltip
                                                .attr("transform", `translate(${event.pageX - 90}, ${event.pageY - 30})`);
                                        })
                                        .on("mouseout", function() {
                                            tooltip.style("opacity", 0);
                                        });
                                
                                    // Add category labels
                                    svg.selectAll(".bar-label")
                                        .data(data)
                                        .enter()
                                        .append("text")
                                        .attr("class", "bar-label")
                                        .attr("x", 5) // Position the category label to the left of the bar
                                        .attr("y", d => y(d.category) + y.bandwidth() / 3 + 5) // Adjust the y to place text on top of the bar
                                        .attr("dy", ".35em") // Vertical alignment
                                        .attr("text-anchor", "start") // Align text to the left of the bar
                                        .attr("fill", "rgb(255,255,255,0.8)")
                                        .style("font-size", "8px")
                                        .text(d => d.category);
                                
                                    // Add value labels
                                    svg.selectAll(".value-label")
                                        .data(data)
                                        .enter()
                                        .append("text")
                                        .attr("class", "value-label")
                                        .attr("x", width - 5) // Set the x position to the right end of the background bar (end of the SVG)
                                        .attr("y", d => y(d.category) + y.bandwidth() / 3 + 5) // Adjust the y to place text on top of the bar
                                        .attr("dy", ".35em") // Vertical alignment
                                        .attr("text-anchor", "end") // Align text to the right end of the background bar
                                        .attr("fill", "rgb(255,255,255,0.8)")
                                        .style("font-size", "12px")
                                        .text(d => `${d.value}%`); // Add "%" symbol to the value
                                }
                                
                                
                        
                        
                        

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
                .attr("stop-color", "Orange")
                .attr("stop-opacity", 1);

            defaultGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "Orange")
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
                .attr("stop-color", "red") // Change to desired color
                .attr("stop-opacity", 1);

            clickedGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "red") // Change to desired color
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
                // Remove Trader layer and source
                if (map.getLayer('Trader_Loc')) {
                    map.removeLayer('Trader_Loc');
                }
                if (map.getSource('Trader')) {
                    map.removeSource('Trader');
                }

                // Remove Walmart layer and source
                if (map.getLayer('Walmart_Loc')) {
                    map.removeLayer('Walmart_Loc');
                }
                if (map.getSource('Walmart')) {
                    map.removeSource('Walmart');
                }

                // Remove Whole Food layer and source
                if (map.getLayer('Whole_Loc')) {
                    map.removeLayer('Whole_Loc');
                }
                if (map.getSource('Whole_Food')) {
                    map.removeSource('Whole_Food');
                }

                // Remove Whole Food layer and source
                if (map.getLayer('Amazon_Loc')) {
                    map.removeLayer('Amazon_Loc');
                }
                if (map.getSource('Amazon')) {
                    map.removeSource('Amazon');
                }
                if (map.getLayer('package-layer')) {
                    map.removeLayer('package-layer'); // 먼저 레이어를 제거
                }
                
                if (map.getSource('package-source')) {
                    map.removeSource('package-source'); // 그런 다음 소스를 제거
                }
     // Remove D3 chart from the container
     const chartContainer = "#table-container"; // 사용한 컨테이너와 동일하게 설정
     d3.select(chartContainer).selectAll("*").remove(); // 차트 제거
}



document.getElementById("btn0").addEventListener("click", function() {
        hideAllContents();
        document.getElementById("content-title").textContent = "Cost Burden and Social Discomfort of Delivery Services";
        document.getElementById("content-text").textContent = "This section will display information about delivery fees.";defineAmazonLayer();
        defineAmazonLayer();
        defineTraderLayer();
        defineWalmartLayer();
        defineWholeLayer(); 
        definePackageLayer();     
        const container = "#table-container";
        createBarChart(rawData, container);
        document.getElementById('table-container2').style.display = 'none';  
        document.getElementById('table-container3').style.display = 'none';  
         

    });
// Button click event listeners for changing content
document.getElementById("btn1").addEventListener("click", function() {
    hideAllContents();
    document.getElementById("content-title").textContent = "Delivery Fee";
    document.getElementById("content-text").textContent = "This section will display information about delivery fees.";
    d3.select(".overlay").style("display", "block");
    document.getElementById('table-container2').style.display = 'none';  
    document.getElementById('table-container3').style.display = 'none'; 
    const container = "#table-container";
    createLineChart(rawData2, container);

});
document.getElementById("btn3").addEventListener("click", function() {
    hideAllContents();
    document.getElementById("content-title").textContent = "Package Theft";
    document.getElementById("content-text").textContent = "This section will display information about package theft.";
    document.getElementById('table-container2').style.display = 'block';    
    document.getElementById('table-container3').style.display = 'block';  
    const container = "#table-container";
    const container2 = "#table-container2";
    const container3 = "#table-container3";
    createBarChart_Package(rawData3, container);  
    createBarChart_Package2(rawData4, container2);   
    createBarChart_Package3(rawData5, container3);   
    });
document.getElementById("btn2").addEventListener("click", function() {
    hideAllContents();
    document.getElementById("content-title").textContent = "Delivery Fee";
    document.getElementById("content-text").textContent = "This section will display information about delivery fees.";
    d3.select(".overlay").style("display", "block");
    document.getElementById('table-container2').style.display = 'none'; 
    document.getElementById('table-container3').style.display = 'none';   
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
                        1, '#428tf4', // Replace 'value1' with actual values from your 'Destrict' field
                        2, '#0f9d58', // Replace 'value2' with another value
                        3, '#f4b400',
                        4, '#db4437',  // And so on, for each distinct 'Destrict' value
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
               d === 3 ? "Orange" :
               d === 4 ? "Red" : "red";
    })
    .attr("stop-opacity", 1);

boroughGradients.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d => {
        // Define the color for the end of each gradient based on borough
        return d === 1 ? "blue" :
               d === 2 ? "green" :
               d === 3 ? "Orange" :
               d === 4 ? "Red" : "lightred";
    })
    .attr("stop-opacity", 0);
        });
});

