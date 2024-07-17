function PeakShifting() {
    const peakTime1 = parseFloat(document.getElementById('peakTime1').value);
    const peakLoad2 = parseFloat(document.getElementById('peakLoad2').value);
    const lifeSpan2 = parseFloat(document.getElementById('lifeSpan2').value);
    const discountRate2 = parseFloat(document.getElementById('discountRate2').value) / 100;
    const J2 = parseFloat(document.getElementById('J2').value);
    const dy2 = parseFloat(document.getElementById('dy2').value);
    const Rg2 = parseFloat(document.getElementById('Rg2').value);
    const Rop = parseFloat(document.getElementById('Rop').value);
    
    const etaRT = 0.85;
    const etadis = 0.9;
    const delta = 0.9;
    const x = 0.012;
    const CRF = (discountRate2 * Math.pow((1 + discountRate2), lifeSpan2)) / (Math.pow((1 + discountRate2), lifeSpan2) - 1);
    
    const Rb = ((CRF + x) * J2) / (etadis * dy2 * delta);
    const Cb = peakLoad2 * peakTime1;
    const Savings = ((peakLoad2 * peakTime1 * Rg2) - (peakLoad2 * peakTime1 * Rb) - (peakLoad2 * peakTime1 * Rop / etaRT)) * dy2;

    displayResults(Cb, Savings, lifeSpan2);
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