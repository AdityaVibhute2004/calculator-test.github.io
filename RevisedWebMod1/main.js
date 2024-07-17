document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('configDropdown');
    const forms = document.querySelectorAll('.configForm');

    function hideAllForms() {
        forms.forEach(form => form.style.display = 'none');
    }

    function clearResults() {
        const resultsContainer = document.getElementById('result');
        const plot = document.getElementById('plot');
        const plot1 = document.getElementById('plot1');
        if (resultsContainer) {
            resultsContainer.innerHTML = ''; // Clear previous results
        } else {
            console.error('Results container not found.');
        }
        
        if (plot) {
            plot.innerHTML = '';
        }

        if (plot1) {
            plot1.innerHTML = '';
        }
    }

    function showSelectedForm() {
        const selectedFormId = dropdown.value;
        const selectedForm = document.getElementById(selectedFormId);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        } else {
            console.error(`Form with ID ${selectedFormId} not found.`);
        }
    }

    dropdown.addEventListener('change', function () {
        hideAllForms();
        clearResults();
        showSelectedForm();
    });

    forms.forEach(form => form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formId = event.target.id;
        console.log(`Form ${formId} submitted.`);
        
        try {
            clearResults();
            if (formId === 'config1Form') {
                DGsetReplacement();
                displayResults();
                plotResults();
            } else if (formId === 'config2Form') {
                Household();
                displayResults();
                plotResults();
            } else if (formId === 'config3Form') {
                PeakShifting();
                displayResults();
                plotResults();
            } else if (formId === 'config4Form') {
                Solar_BESS();
                displayResults1();
                plotResults1();
                plotResults2();
            } else if (formId === 'config5Form') {
                PeakShifting_Solar();
                displayResults2();
                plotResults();
            } else {
                console.error(`Unknown form ID: ${formId}`);
            }
        } catch (error) {
            console.error(`Error handling form ${formId}:`, error);
        }
    }));

    // Initial call to display the selected configuration form
    hideAllForms();
    showSelectedForm();
});

