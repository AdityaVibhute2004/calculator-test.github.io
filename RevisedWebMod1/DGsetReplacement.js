function DGsetReplacement() {
    const outageTime = parseFloat(document.getElementById('outageTime').value);
    const peakLoad = parseFloat(document.getElementById('peakLoad').value);
    const lifeSpan = parseFloat(document.getElementById('lifeSpan').value);
    const discountRate = parseFloat(document.getElementById('discountRate').value) / 100;
    const J = parseFloat(document.getElementById('J').value);
    const dy = parseFloat(document.getElementById('dy').value);
    const Rg = parseFloat(document.getElementById('Rg').value);
    const Rd = parseFloat(document.getElementById('Rd').value);
    
    const etaRT = 0.85;
    const etadis = 0.9;
    const delta = 0.9;
    const x = 0.012;
    const CRF = (discountRate * Math.pow((1 + discountRate), lifeSpan)) / (Math.pow((1 + discountRate), lifeSpan) - 1);
    const epsilon = Rg / Rd;

    const Rb = ((CRF + x) * J) / (etadis * dy * delta);
    const Cb = peakLoad * outageTime;
    const costBefore = Rg * peakLoad * (24 - outageTime) + Rd * peakLoad * outageTime;
    const costAfter = Rg * peakLoad * (24 - outageTime) + Rb * peakLoad * outageTime + Rg * peakLoad * outageTime / etaRT;
    const Savings = (costBefore - costAfter) * dy;

    displayResults(Cb, Savings, lifeSpan);
}

function displayResults(Cb, Savings, lifeSpan) {
    const resultText =`
        <h4>Results</h4>
        <p>Battery Capacity required: ${Cb.toFixed(2)} kWh</p>
        <p>Total annual savings: Rs ${Savings.toFixed(2)}</p>
    `;
    document.getElementById('result').innerHTML = resultText;
  
    plotResults(Savings, lifeSpan);
}

function plotResults(Savings, lifeSpan) {
    // Calculate cumulative savings
    let cumulativeSavings = [];
    let cumulative = 0;
    for (let year = 1; year <= lifeSpan; year++) {
        cumulative += Savings;
        cumulativeSavings.push(cumulative);
    }

    // Prepare data for Plotly
    let years = Array.from({ length: lifeSpan }, (v, i) => i + 1);

    let trace = {
        x: years,
        y: cumulativeSavings,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Cumulative Levelized Savings'
    };

    let layout = {
        title: 'Cumulative Levelized Savings Over Project Lifespan',
        xaxis: { title: 'Year' },
        yaxis: { title: 'Cumulative Levelized Savings (Rs)' }
    };

    // Plot the data
    Plotly.newPlot('plot', [trace], layout);
}