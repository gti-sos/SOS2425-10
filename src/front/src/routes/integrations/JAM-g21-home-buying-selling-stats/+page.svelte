<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { dev, browser } from '$app/environment';

    // @ts-ignore
    const Highcharts = window.Highcharts;

    interface Registration {
        year: number | string;
        province: string;
        total_general: number;
    }

    interface Transaction {
        year: number | string;
        province: string;
        transaction_total: number;
    }

    let chart: any;
    let years: number[] = [];
    let selectedYear: number;

    const registrationByYear = new Map<number, number>();
    const transactionByYear = new Map<number, number>();

    if (browser) {
        onMount(async () => {
            const API_LOCAL = dev
                ? "http://localhost:16079/api/v1/registrations-stats"
                : "/api/v1/registrations-stats";

            const API_EXTERNAL = dev
                ? "http://localhost:16079/api-proxy/api/v1/home-buying-selling-stats"
                : "/api-proxy/api/v1/home-buying-selling-stats";

            const [resLocal, resExternal] = await Promise.all([
                fetch(API_LOCAL),
                fetch(API_EXTERNAL)
            ]);

            const localData: Registration[] = await resLocal.json();
            const externalData: Transaction[] = await resExternal.json();

            years = [...new Set([
                ...localData.map(d => Number(d.year)),
                ...externalData.map(d => Number(d.year))
            ])].sort((a, b) => a - b);

            years.forEach(year => {
                const regTotal = localData
                    .filter(d => Number(d.year) === year)
                    .reduce((sum, d) => sum + (Number(d.total_general) || 0), 0);
                registrationByYear.set(year, regTotal);

                const transTotal = externalData
                    .filter(d => Number(d.year) === year)
                    .reduce((sum, d) => sum + (Number(d.transaction_total) || 0), 0);
                transactionByYear.set(year, transTotal);
            });

            selectedYear = years[years.length - 1];
            updateChart();
        });
    }

    function updateChart() {
        const registrations = registrationByYear.get(selectedYear) || 0;
        const transactions = transactionByYear.get(selectedYear) || 0;

        if (chart) {
            chart.update({
                title: { text: `Distribución en ${selectedYear}` },
                series: [{
                    data: [
                        { name: 'Matriculaciones', y: registrations },
                        { name: 'Transacciones vivienda', y: transactions }
                    ]
                }]
            });
        } else {
            chart = Highcharts.chart('container', {
                chart: { type: 'pie' },
                title: { text: `Distribución en ${selectedYear}` },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> (<b>{point.y}</b>)'
                },
                accessibility: {
                    point: { valueSuffix: '%' }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    name: 'Cantidad',
                    colorByPoint: true,
                    data: [
                        { name: 'Matriculaciones', y: registrations },
                        { name: 'Transacciones vivienda', y: transactions }
                    ]
                }],
                credits: { enabled: false }
            });
        }
    }
</script>

{#if browser}
<figure class="highcharts-figure">
    <label for="year-select" style="display: block; text-align: center; margin-bottom: 10px;">
        Selecciona año:
        <select id="year-select" bind:value={selectedYear} on:change={updateChart}>
            {#each years as y}
                <option value={y}>{y}</option>
            {/each}
        </select>
    </label>
    <div id="container" style="width: 100%; height: 500px;"></div>
    <p class="highcharts-description">
        Comparativa de proporción entre matriculaciones (API propia) y transacciones de vivienda (grupo 21) para el año seleccionado.
    </p>
</figure>
{/if}

<style>
    .highcharts-figure {
        max-width: 800px;
        margin: auto;
    }

    .highcharts-description {
        text-align: center;
        margin-top: 1rem;
        color: #555;
    }

    select {
        padding: 0.3em 0.6em;
        font-size: 1rem;
        margin-left: 0.5em;
    }
</style>
