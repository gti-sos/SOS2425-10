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
        total_general: number;
    }

    interface GDPEntry {
        date: string;
        value: number | null;
    }

    let chart: any;

    onMount(async () => {
        if (!browser) return;

        const REG_API = dev
            ? "http://localhost:16079/api/v1/registrations-stats"
            : "/api/v1/registrations-stats";

        const WB_API = "https://api.worldbank.org/v2/country/ES/indicator/NY.GDP.MKTP.CD?format=json&per_page=100";

        const [resReg, resWB] = await Promise.all([
            fetch(REG_API),
            fetch(WB_API)
        ]);

        const regDataRaw: Registration[] = await resReg.json();
        const wbDataRaw = await resWB.json();
        const wbData: GDPEntry[] = wbDataRaw[1]; // la parte con los datos reales

        // Agrupar matriculaciones por año
        const registrationsByYear: Record<number, number> = {};
        regDataRaw.forEach(d => {
            registrationsByYear[d.year] = (registrationsByYear[d.year] || 0) + d.total_general;
        });

        const years = [...new Set([
            ...Object.keys(registrationsByYear).map(Number),
            ...wbData.map(d => parseInt(d.date))
        ])]
            .filter(y => y >= 2000 && y <= 2025) // filtro para no mostrar años vacíos
            .sort();

        const seriesRegistrations = years.map(y => registrationsByYear[y] || null);
        const seriesGDP = years.map(y => {
            const match = wbData.find(d => parseInt(d.date) === y);
            return match?.value || null;
        });

        chart = Highcharts.chart('container', {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Evolución del PIB vs Matriculaciones en España'
            },
            xAxis: {
                categories: years.map(String),
                title: { text: 'Año' },
                tickmarkPlacement: 'on'
            },
            yAxis: [{
                title: {
                    text: 'Matriculaciones'
                },
                opposite: false
            }, {
                title: {
                    text: 'PIB (USD)'
                },
                opposite: true
            }],
            tooltip: {
                shared: true,
                valueDecimals: 0
            },
            credits: { enabled: false },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [
                {
                    name: 'Matriculaciones',
                    data: seriesRegistrations,
                    yAxis: 0,
                    color: '#7cb5ec'
                },
                {
                    name: 'PIB (USD)',
                    data: seriesGDP,
                    yAxis: 1,
                    color: '#434348'
                }
            ]
        });
    });
</script>

{#if browser}
<figure class="highcharts-figure">
    <div id="container" style="width: 100%; height: 500px;"></div>
    <p class="highcharts-description">
        Comparativa visual del Producto Interior Bruto (PIB) de España con el número total de matriculaciones por año.
        El gráfico usa un formato de área suavizada (`spline area`) para destacar tendencias de evolución.
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
