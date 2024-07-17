function Solar_BESS() {
    const PS = parseFloat(document.getElementById('Solar Capacity').value);
    const SolarTime = parseFloat(document.getElementById('SolarTime').value);
    const peakLoad = parseFloat(document.getElementById('peakLoad3').value);
    const lifeSpan_Solar = parseFloat(document.getElementById('lifeSpan_solar').value);
    const lifeSpan_Bat = parseFloat(document.getElementById('lifeSpan_bat').value);
    const discountRate3 = parseFloat(document.getElementById('discountRate3').value) / 100;
    const J3 = parseFloat(document.getElementById('J3').value);
    const K1 = parseFloat(document.getElementById('K1').value);
    const dy3 = parseFloat(document.getElementById('dy3').value);
    const Rg3 = parseFloat(document.getElementById('Rg3').value);
    const C = parseFloat(document.getElementById('C-rating').value);
    const Xs = parseFloat(document.getElementById('Capacity per area').value);
    const A = parseFloat(document.getElementById('Area Available').value);
   
    const etaRT = 0.85;
    const etaC = 0.9;
    const etadis = 0.95;
    const delta = 0.9;
    const x = 0.012;

    function CRF (discountRate3, lifespan) {
        return (discountRate3 * Math.pow((1 + discountRate3), lifespan)) / (Math.pow((1 + discountRate3), lifespan) - 1);
    }  

    const CRFB = CRF(discountRate3, lifeSpan_Bat);
    const CRFS = CRF(discountRate3, lifeSpan_Solar);
    const Rb = ((CRFB + x) * J3) / (etadis * dy3 * delta);
    const Rs =  (CRFS*K1)/(dy3*SolarTime);
    const Rb_prime = Rb + Rs/etaRT;
    const Cb = etaC*(PS - peakLoad)*SolarTime/delta;
    const chi = (PS/peakLoad) - 1;
    const Rbar = (Rs + Rb_prime*etaRT*chi) / (1 + etaRT*chi);
    const Eg = peakLoad*SolarTime + etaRT*(PS - peakLoad)*SolarTime;
    const Savings = (Rg3 - Rbar)*Eg*dy3;

    if(delta/(C*etaC*SolarTime) < chi < (Xs*A/peakLoad) - 1) {
        if(Savings > 0) {
            displayResults1(PS, Savings, lifeSpan_Solar, Rbar, Eg);
        } else {
            document.getElementById('result').innerHTML = '<p>The investment is not profitable.</p>';
        }
    } else if (chi > (Xs*A/peakLoad) - 1) {
        document.getElementById('result').innerHTML = '<p>The solar capacity being used is not available.</p>';
    } else if (delta/(C*etaC*SolarTime) > chi) {
        document.getElementById('result').innerHTML = '<p>The solar capacity being used is not enough for the model to work.</p>';
    }
    
    plotResults2(delta, C, etaC, SolarTime, Xs, A, peakLoad, Rs, Rb_prime, etaRT);
    displayResults1(Savings, Rbar, Eg, Cb, lifeSpan_Solar)
}

function displayResults1(Savings, Rbar, Eg, Cb, lifeSpan_Solar) {
    const resultText = `
        <h4>Results</h4>
        <p>Battery Capacity required: ${Cb.toFixed(2)} kWh</p>
        <p>Effective Levelised Cost of Solar + Battery System: Rs ${Rbar.toFixed(2)}</p>
        <p>Total Energy being saved from Grid daily: ${Eg.toFixed(2)}</p>
        <p>Total annual savings: Rs ${Savings.toFixed(2)}</p>
    `;
    document.getElementById('result').innerHTML = resultText;
    plotResults1(Savings, lifeSpan_Solar);
}

function plotResults1(Savings, lifeSpan) {
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

function range(start, end) {
    let array = [];
    for (let i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
}

function plotResults2(delta, C, etaC, SolarTime, XS, A, peakLoad, Rs, Rb_prime, etaRT) {
    let chi = range(delta/(C*etaC*SolarTime), (XS*A/peakLoad) - 1);
    let Rbar_array = [];
    for(let i = 0; i < chi.length; i++) {
        Rbar_array.push((Rs + Rb_prime * etaRT * chi[i]) / (1 + etaRT * chi[i]));
    }

    let trace = {
        x: chi,
        y: Rbar_array,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Levelised Cost of Savings Vs Chi'
    };

    let layout = {
        title: 'Levelised Cost of Savings Vs Chi',
        xaxis: { title: 'Chi' },
        yaxis: { title: 'Rbar' }
    };

    Plotly.newPlot('plot1', [trace], layout);
}


