function Household() {
    const peakTime = parseFloat(document.getElementById('peakTime').value);
    const peakLoad1 = parseFloat(document.getElementById('peakLoad1').value);
    const lifeSpan1 = parseFloat(document.getElementById('lifeSpan1').value);
    const discountRate1 = parseFloat(document.getElementById('discountRate1').value) / 100;
    const J1 = parseFloat(document.getElementById('J1').value);
    const K = parseFloat(document.getElementById('K').value);
    const dy1 = parseFloat(document.getElementById('dy1').value);
    const Rg1 = parseFloat(document.getElementById('Rg1').value);
    
    const Ts = 5;
    const etaRT = 0.85;
    const etadis = 0.9;
    const delta = 0.9;
    const x = 0.012;
    const CRF = (discountRate1 * Math.pow((1 + discountRate1), lifeSpan1)) / (Math.pow((1 + discountRate1), lifeSpan1) - 1);
    
    const Rb = ((CRF + x) * J1) / (etadis * dy1 * delta);
    const Rs = (CRF * K) / (Ts * dy1);
    const Cb = peakLoad1 * peakTime;
    const Savings = (peakLoad1 * peakTime * (Rg1 - (Rb + (Rs / etaRT)))) * dy1;

    displayResults(Cb, Savings, lifeSpan1);
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
        name: 'Cumulative Savings'
    };

    let layout = {
        title: 'Cumulative Savings Over Project Lifespan',
        xaxis: { title: 'Year' },
        yaxis: { title: 'Cumulative Levelized Savings (Rs)' }
    };

    // Plot the data
    Plotly.newPlot('plot', [trace], layout);
}