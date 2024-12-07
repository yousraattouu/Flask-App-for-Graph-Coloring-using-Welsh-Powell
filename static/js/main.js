document.addEventListener('DOMContentLoaded', () => {
    const colorizeBtn = document.getElementById('colorize-btn');
    const graphInput = document.getElementById('graph-input');
    const graphOutput = document.getElementById('graph-output');

    colorizeBtn.addEventListener('click', () => {
        const graph = JSON.parse(graphInput.value);
        
        fetch('/colorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ graph }),
        })
        .then(response => response.json())
        .then(data => {
            visualizeGraph(graph, data.colors, data.num_colors);
        })
        .catch(error => {
            console.error('Error:', error);
            graphOutput.innerHTML = `<p>Une erreur s'est produite : ${error.message}</p>`;
        });
    });

    function visualizeGraph(graph, colors, numColors) {
        graphOutput.innerHTML = '';

        const colorMessage = document.createElement('p');
        colorMessage.textContent = `Nombre de couleurs nécessaires : ${numColors}`;
        colorMessage.style.textAlign = 'center';
        colorMessage.style.fontSize = '18px';
        colorMessage.style.fontWeight = 'bold';
        colorMessage.style.marginBottom = '10px';
        graphOutput.appendChild(colorMessage);

        const width = graphOutput.clientWidth;
        const height = 400; // Fixed height for better visibility

        const svg = d3.select(graphOutput)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const nodes = Object.keys(graph).map(node => ({ id: node }));
        const links = [];
        Object.entries(graph).forEach(([source, targets]) => {
            targets.forEach(target => {
                links.push({ source, target });
            });
        });

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.8);

        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 20)
            .attr("fill", d => d3.schemeCategory10[colors[d.id]])
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .text(d => d.id)
            .attr("font-size", "12px")
            .attr("dx", -5)
            .attr("dy", 5);

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
    }
});
