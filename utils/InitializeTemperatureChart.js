import { temperaturesMap } from './Maps.js';
import { temperatureMediansNationalLast5Years } from './medians_temperatures.js';

export function initializeTemperatureChart(departmentName) {

    const ctx = document.getElementById('temperatures').getContext('2d');

    const departmentData = Array.from(temperaturesMap.get(departmentName).values());
    const frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const months = departmentData.map((_, index) => frenchMonths[index]);

    const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [
        {
            label: 'Temperature moyenne',
            data: departmentData.map(d => d.averageTemperature),
            borderColor: 'brown',
            fill: false,
            cubicInterpolationMode: 'monotone',
        },
        {
            label: 'Temperature maximale',
            data: departmentData.map(d => d.averageTemperatureMax),
            borderColor: 'orange',
            cubicInterpolationMode: 'monotone',
        },
        {
            label: 'Temperature minimale',
            data: departmentData.map(d => d.averageTemperatureMin),
            borderColor: 'blue',
            fill: '-1', // Fill from this line to the line above it in the dataset array
            cubicInterpolationMode: 'monotone',
        },
        {
            label: 'Temperature moyenne nationale',
            data: temperatureMediansNationalLast5Years.map(d => d.tmoy),
            borderColor: 'red',
            borderDash: [5, 5],
            fill: false,
            cubicInterpolationMode: 'monotone',
        }
        ]
    },
    options: {
        plugins: {
        legend: {
            labels: {
            color: 'black'
            }
        },
        },
        scales: {
        x: {
            ticks: {
            color: 'black'
            },
            title: {
            color: 'black'
            }
        },
        y: {
            ticks: {
            color: 'black'
            },
            title: {
            color: 'black'
            }
        }
        }
    }
    });  
}