<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { dev, browser } from '$app/environment';

    // @ts-ignore
    const Highcharts = window.Highcharts;

    interface Registration {
        year: number;
        total_general_national: number;
        total_general_import: number;
        total_general_auction: number;
    }

    interface AnnualEvolution {
        year: number;
        energy_sold: number;
    }

    let chart: any;

    if (browser) {
        onMount(() => {
            const REG_API = dev
                ? "http://localhost:16079/api/v1/registrations-stats"
                : "/api/v1/registrations-stats";

            const ENERGY_API = dev
                ? "http://localhost:16079/api-proxy/api/v1/annual-evolutions"
                : "/api-proxy/api/v1/annual-evolutions";

            async function fetchAndUpdateChart() {
                const [regRes, energyRes] = await Promise.all([
                    fetch(REG_API),
                    fetch(ENERGY_API)
                ]);

                const regData: Registration[] = await regRes.json();
                const energyData: AnnualEvolution[] = await energyRes.json();

                const years = [...new Set([
                    ...regData.map(d => d.year),
                    ...energyData.map(d => d.year)
                ])].sort();

                const national = years.map(y =>
                    regData.filter(d => d.year === y)
                        .reduce((sum, d) => sum + (d.total_general_national || 0), 0)
                );

                const imported = years.map(y =>
                    regData.filter(d => d.year === y)
                        .reduce((sum, d) => sum + (d.total_general_import || 0), 0)
                );

                const auction = years.map(y =>
                    regData.filter(d => d.year === y)
                        .reduce((sum, d) => sum + (d.total_general_auction || 0), 0)
                );

                const energy = years.map(y =>
                    energyData.filter(d => d.year === y)
                        .reduce((sum, d) => sum + (d.energy_sold || 0), 0)
                );

                if (!chart) {
                    chart = Highcharts.chart('container', {
                        chart: { type: 'column' },
                        title: { text: 'Matriculaciones y Energía Vendida por Año' },
                        xAxis: {
                            categories: years.map(String),
                            title: { text: 'Año' },
                            gridLineWidth: 1
                        },
                        yAxis: {
                            min: 0,
                            title: { text: 'Cantidad' },
                            labels: { overflow: 'justify' }
                        },
                        tooltip: { shared: true },
                        plotOptions: {
                            column: {
                                borderRadius: 4,
                                groupPadding: 0.1,
                                dataLabels: { enabled: true }
                            }
                        },
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        },
                        credits: { enabled: false },
                        series: [
                            { name: 'Matriculaciones Nacionales', data: national },
                            { name: 'Matriculaciones Importadas', data: imported },
                            { name: 'Matriculaciones Subasta', data: auction },
                            { name: 'Energía Vendida (GWh)', data: energy }
                        ]
                    });
                } else {
                    chart.xAxis[0].setCategories(years.map(String));
                    chart.series[0].setData(national);
                    chart.series[1].setData(imported);
                    chart.series[2].setData(auction);
                    chart.series[3].setData(energy);
                }
            }

            fetchAndUpdateChart();
            const interval = setInterval(fetchAndUpdateChart, 4000);
            return () => clearInterval(interval);
        });
    }
</script>

{#if browser}
<figure class="highcharts-figure">
    <div id="container" style="width: 100%; height: 500px;"></div>
    <p class="highcharts-description">
        Este gráfico representa la comparación por año entre las matriculaciones (datos propios) y la energía vendida (API externa).
        Integra ambas APIs vía fetch, incluyendo proxy propio.
    </p>
</figure>
{/if}

<style>
    .highcharts-figure {
        min-width: 310px;
        max-width: 1000px;
        margin: 1em auto;
    }
    .highcharts-description {
        margin: 1rem;
        text-align: center;
        color: #555;
    }
</style>
