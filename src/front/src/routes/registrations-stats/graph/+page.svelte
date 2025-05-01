<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v1/registrations-stats/data';
    if (dev) API = 'http://localhost:16079' + API;

    let chart: any;

    async function fetchDataAndRenderChart() {
        try {
            const res = await fetch(API);
            const data = await res.json();

            const years = ['2018', '2019', '2020'];
            const national: number[] = [];
            const imported: number[] = [];
            const auction: number[] = [];

            years.forEach((year) => {
                type Registration = {
    year: number;
    province: string;
    total_general_national: number;
    total_general_import: number;
    total_general_auction: number;
    total_general: number;
};

const group = (data as Registration[]).filter((d: Registration) => d.year === parseInt(year));
national.push(group.reduce((acc: number, d: Registration) => acc + d.total_general_national, 0));
imported.push(group.reduce((acc: number, d: Registration) => acc + d.total_general_import, 0));
auction.push(group.reduce((acc: number, d: Registration) => acc + d.total_general_auction, 0));

            });

            const chartOptions = {
                chart: { type: 'column' },
                title: { text: 'Matriculaciones por Año y Tipo' },
                xAxis: { categories: years },
                yAxis: {
                    min: 0,
                    title: { text: 'Cantidad de matriculaciones' }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' matriculaciones'
                },
                plotOptions: {
                    column: {
                        borderRadius: 5,
                        pointPadding: 0.2
                    }
                },
                series: [
                    { name: 'Nacionales', data: national },
                    { name: 'Importados', data: imported },
                    { name: 'Subastas', data: auction }
                ]
            };

            if (!chart) {
                // @ts-ignore
                chart = Highcharts.chart('container', chartOptions);
            } else {
                chart.update(chartOptions, true, true);
            }

        } catch (error) {
            console.error("❌ Error al cargar datos del gráfico", error);
        }
    }

    onMount(() => {
        fetchDataAndRenderChart();
        setInterval(fetchDataAndRenderChart, 2000); // actualizar cada 2 segundos
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        Este gráfico se actualiza automáticamente para reflejar cualquier cambio hecho en los datos de matriculaciones (añadir, editar o eliminar).
    </p>
</figure>

<style>
    .highcharts-figure {
        min-width: 360px;
        max-width: 800px;
        margin: 1em auto;
    }

    .highcharts-description {
        text-align: center;
        font-family: Arial, sans-serif;
        color: #444;
        margin-top: 0.5em;
    }
</style>
