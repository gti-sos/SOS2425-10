<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { dev, browser } from '$app/environment';

    // @ts-ignore
    const Highcharts = window.Highcharts;

    interface Accident {
        year: number | string;
        total_victims: number;
    }

    interface Precipitation {
        year: number | string;
        annual_precipitation: number;
    }

    let chart: any;

    if (browser) {
        onMount(() => {
            const API_LOCAL = dev
                ? "http://localhost:16079/api/v2/accidents-stats"
                : "/api/v2/accidents-stats";

            const API_EXTERNAL = dev
                ? "http://localhost:16079/api-proxy/api/v1/precipitation-stats"
                : "/api-proxy/api/v1/precipitation-stats";

            async function fetchAndUpdateChart() {
                const [resLocal, resExternal] = await Promise.all([
                    fetch(API_LOCAL, { cache: "no-store" }),
                    fetch(API_EXTERNAL, { cache: "no-store" })
                ]);

                const localData: Accident[] = await resLocal.json();
                const externalData: Precipitation[] = await resExternal.json();

                const years = [...new Set([
                    ...localData.map(d => Number(String(d.year).trim())),
                    ...externalData.map(d => Number(String(d.year).trim()))
                ])].sort((a, b) => a - b);

                const victimsScatter = years.map(y => {
                    const total = localData
                        .filter(d => Number(String(d.year).trim()) === y)
                        .reduce((sum, d) => sum + (Number(d.total_victims) || 0), 0);
                    return { x: y, y: total };
                });

                const precipitationScatter = years.map(y => {
                    const total = externalData
                        .filter(d => Number(String(d.year).trim()) === y)
                        .reduce((sum, d) => sum + (Number(d.annual_precipitation) || 0), 0);
                    return { x: y, y: total };
                });

                if (chart && chart.series && chart.series.length >= 2) {
                    chart.series[0].setData(victimsScatter);
                    chart.series[1].setData(precipitationScatter);
                } else {
                    chart = Highcharts.chart('container', {
                        chart: { type: 'scatter' },
                        title: { text: 'Precipitación vs Víctimas por Año' },
                        xAxis: {
                            title: { text: 'Año' },
                            allowDecimals: false
                        },
                        yAxis: {
                            title: { text: 'Cantidad' },
                            allowDecimals: false
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.y}</b> en {point.x}'
                        },
                        plotOptions: {
                            scatter: {
                                marker: { radius: 6 },
                                dataLabels: { enabled: true },
                                tooltip: {
                                    headerFormat: '',
                                    pointFormat: '{series.name}: <b>{point.y}</b> en {point.x}'
                                }
                            }
                        },
                        series: [
                            { name: 'Víctimas por accidente (API propia)', data: victimsScatter },
                            { name: 'Precipitación anual (grupo 15)', data: precipitationScatter }
                        ],
                        credits: { enabled: false }
                    });
                }
            }

            fetchAndUpdateChart();
            const interval = setInterval(fetchAndUpdateChart, 5000);
            return () => clearInterval(interval);
        });
    }
</script>

{#if browser}
<figure class="highcharts-figure">
    <div id="container" style="width: 100%; height: 500px;"></div>
    <p class="highcharts-description">
        Gráfico tipo <strong>scatter</strong> que compara las víctimas por accidente (API propia) con la precipitación anual (grupo 15), agrupadas por año.
    </p>
</figure>
{/if}

<style>
    .highcharts-figure {
        max-width: 1000px;
        margin: auto;
    }
    .highcharts-description {
        text-align: center;
        margin-top: 1rem;
        color: #444;
    }
</style>
