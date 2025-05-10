<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    import { dev, browser } from '$app/environment';

    // @ts-ignore
    const Highcharts = window.Highcharts;

    interface VCH {
        year: number | string;
        total_victims: number;
    }

    interface ExternalStat {
        year: number | string;
        total_points_deducted: number;
    }

    let chart: any;

    if (browser) {
        onMount(() => {
            const API_LOCAL = dev
                ? "http://localhost:16079/api/v2/accidents-stats"
                : "/api/v2/accidents-stats";

            const API_EXTERNAL = dev
                ? "http://localhost:16079/api-proxy/api/v1/sanctions-and-points-stats"
                : "/api-proxy/api/v1/sanctions-and-points-stats";

            async function fetchAndUpdateChart() {
                const [resLocal, resExternal] = await Promise.all([
                    fetch(API_LOCAL, { cache: "no-store" }),
                    fetch(API_EXTERNAL, { cache: "no-store" })
                ]);

                const localData: VCH[] = await resLocal.json();
                const externalData: ExternalStat[] = await resExternal.json();

                // 🔧 Normalizar y limpiar los años
                const years = [...new Set([
                    ...localData.map(d => Number(String(d.year).trim())),
                    ...externalData.map(d => Number(String(d.year).trim()))
                ])].sort((a, b) => a - b);

                const localVictims = years.map(y =>
                    localData
                        .filter(d => Number(String(d.year).trim()) === y)
                        .reduce((sum, d) => sum + (Number(d.total_victims) || 0), 0)
                );

                const externalPoints = years.map(y =>
                    externalData
                        .filter(d => Number(String(d.year).trim()) === y)
                        .reduce((sum, d) => sum + (d.total_points_deducted || 0), 0)
                );

                if (chart && chart.series && chart.series.length >= 2) {
                    chart.xAxis[0].setCategories(years.map(String));
                    chart.series[0].setData(localVictims);
                    chart.series[1].setData(externalPoints);
                } else {
                    chart = Highcharts.chart('container', {
                        chart: { type: 'column' },
                        title: { text: 'Comparación de víctimas y puntos retirados por año' },
                        xAxis: {
                            categories: years.map(String),
                            title: { text: 'Año' }
                        },
                        yAxis: {
                            min: 0,
                            title: { text: 'Cantidad' },
                            allowDecimals: false,
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
                        series: [
                            { name: 'Víctimas (API propia)', data: localVictims },
                            { name: 'Puntos retirados (Grupo 19)', data: externalPoints }
                        ],
                        credits: { enabled: false }
                    });
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
        Gráfico que compara el número total de víctimas por accidente (API propia) y los puntos retirados del carné (API externa del grupo 19) agrupados por año.
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
