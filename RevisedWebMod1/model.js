function handleCalculationConfig1() {
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

function handleCalculationConfig2() {
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

function handleCalculationConfig3() {
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
        yaxis: { title: 'Cumulative Savings (Rs)' }
    };

    // Plot the data
    Plotly.newPlot('plot', [trace], layout);
}


