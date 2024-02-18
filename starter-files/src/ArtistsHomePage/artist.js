import { items } from "../../data/data.js";
import { getCurrentArtist } from "../globals.js";
import { formatDate, generateDateLabels } from "../utils/dates.js";

//selectors
const soldElement = document.querySelector('.sold');
const incomeElement = document.querySelector('.income');

export const getArtistName = () => {
    const select = document.querySelector(".join-artist-select");
    const selectedOption = select.value;
    const artistTitle = document.querySelector('.title');
    artistTitle.textContent = selectedOption;
    return selectedOption;
}

export const renderArtist = () => {
    const soldElement = document.querySelector('.sold');
    const incomeElement = document.querySelector('.income');
    const artistName = getCurrentArtist();

    const artistItems = items.filter(item => item.artist === artistName);
    const soldArtistItems = artistItems.filter(item => !!item.priceSold);
    const soldItems = artistItems.filter(item => item.dateSold);
    const totalIncomeVal = soldItems.reduce((sum, item) => {
        return sum + item.priceSold;
    }, 0);

    soldElement.textContent = `${soldItems.length}/${artistItems.length} `;
    incomeElement.textContent = `$${totalIncomeVal}`;

    const lastSeven = document.getElementById('7');
    const lastFourteen = document.getElementById('14');
    const lastThirty = document.getElementById('30');

    const updateChartLabels = (days) => {
        const labels = generateDateLabels(days);

        const canvas = document.getElementById('myChart');
        const ctx = canvas.getContext('2d');
    
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'amount',
                    data: calculateChartData(labels, soldArtistItems),
                    backgroundColor: '#A16A5E',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const buttons = [lastSeven, lastFourteen, lastThirty];
    buttons.forEach(button => {
        button.classList.add('btn-brown')
        button.addEventListener('click', (event) =>{
            buttons.forEach(btn => btn.classList.remove('btn-orange'));
            event.target.classList.add('btn-orange');
        })
    })

    lastSeven.addEventListener('click', () => {
        updateChartLabels(7);
       
    });

    lastFourteen.addEventListener('click', () => {
        updateChartLabels(14);
        
    });

    lastThirty.addEventListener('click', () => {
        updateChartLabels(30);
    });

    lastFourteen.classList.add('btn-orange');
    updateChartLabels(14);
};

function calculateChartData(labels, soldArtistItems) {
    return labels.map(label => {
        let sum = 0;
        soldArtistItems.forEach(item => {
            if (label === formatDate(item.dateSold)) {
                sum += item.priceSold;
            }
        });
        return sum;
    });
}
