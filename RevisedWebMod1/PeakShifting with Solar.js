function PeakShifting_Solar() {
    const PS = parseFloat(document.getElementById('Solar Capacity1').value);
    const SolarTime = parseFloat(document.getElementById('SolarTime1').value);
    const peakLoad = parseFloat(document.getElementById('peakLoad4').value);
    const TP = parseFloat(document.getElementById('peakTime2').value);
    const TL = parseFloat(document.getElementById('load Time').value); 
    const lifeSpan_Solar = parseFloat(document.getElementById('lifeSpan_solar1').value);
    const lifeSpan_Bat = parseFloat(document.getElementById('lifeSpan_bat1').value);
    const discountRate4 = parseFloat(document.getElementById('discountRate4').value) / 100;
    const J4 = parseFloat(document.getElementById('J4').value);
    const K2 = parseFloat(document.getElementById('K2').value);
    const dy4 = parseFloat(document.getElementById('dy4').value);
    const Rg4 = parseFloat(document.getElementById('Rg4').value);
    const epsilon = parseFloat(document.getElementById('epsilon').value)
    const C = parseFloat(document.getElementById('C-rating1').value);
   
    const etaRT = 0.855;
    const etaC = 0.9;
    const etadis = 0.95;
    const delta = 0.9;
    const x = 0.012;

    function CRF (discountRate4, lifespan) {
        return (discountRate4 * Math.pow((1 + discountRate4), lifespan)) / (Math.pow((1 + discountRate4), lifespan) - 1);
    }  

    const CRFB = CRF(discountRate4, lifeSpan_Bat);
    const CRFS = CRF(discountRate4, lifeSpan_Solar);
    const Cb = peakLoad*TP/(etadis*delta);

    let Rb = (x + CRFB)*J4/(etadis*delta*dy4);
    let Rs = CRFS*K2/(SolarTime*dy4);  
    let Rb_prime = Rb + Rs/etaRT;
    let Eg = PS*SolarTime - peakLoad*TP*((1/etaRT)-1);
    let Rbar = (Rs*(PS*SolarTime - (peakLoad*TP/etaRT)) + Rb_prime*peakLoad*TP)/Eg;
    let Rgbar = ((Rg4/epsilon)*(PS*SolarTime - (peakLoad*TP/etaRT)) + Rg4*peakLoad*TP)/Eg;
    let Savings = (Rgbar - Rbar)*Eg*dy4;

    if(Cb >= peakLoad/C && PS*SolarTime >= peakLoad*TP/etaRT){
        displayResults2(Savings, Rbar, Eg, Cb, lifeSpan_Solar)
    } else if (PS*SolarTime < peakLoad*TP/etaRT) {
        const resultText = `
        <p>Solar Capacity is insufficient to meet peak load.</p>
    `;
    document.getElementById('result').innerHTML = resultText; 
    } else if (Cb <= peakLoad/C) {
        const resultText = `
        <p>Battery cannot discharge completely in the peak load timing. Hence, need a
        higher capacity.</p>
    `;
    document.getElementById('result').innerHTML = resultText;
    }
}

function displayResults2(Savings, Rbar, Eg, Cb, lifeSpan_Solar) {
    const resultText = `
        <h4>Results</h4>
        <p>Battery Capacity required: ${Cb.toFixed(2)} kWh</p>
        <p>Effective Levelised Cost of Solar + Battery System: Rs ${Rbar.toFixed(2)}</p>
        <p>Total Energy being saved from Grid daily: ${Eg.toFixed(2)} kWh</p>
        <p>Total annual savings: Rs ${Savings.toFixed(2)}</p>
    `;
    document.getElementById('result').innerHTML = resultText;
    plotResults1(Savings, lifeSpan_Solar);
}

function plotResults(Savings, lifeSpan) {
    let cumulativeSavings = [];
    let cumulative = 0;
    for (let year = 1; year <= lifeSpan; year++) {
        cumulative += Savings;
        cumulativeSavings.push(cumulative);
    }

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

    Plotly.newPlot('plot', [trace], layout);
}