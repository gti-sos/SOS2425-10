<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>



</svelte:head>

<style>
    .highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
    max-width: 800px;
    margin: 1em auto;
}

#container {
    height: 450px;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tbody tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

.highcharts-description {
    margin: 0.3rem 10px;
}

</style>

<script>
// @ts-nocheck

    import { onMount } from "svelte";

    onMount(async () => {
        try {
            const response = await fetch("https://sos2425-17.onrender.com/api/v2/university-academic-performance");
            
            if (!response.ok) {
                console.error("Error al hacer fetch: ", response.status, response.statusText);
                return;
            }
            const data = await response.json();
            console.log("Datos recibidos:", data);
            // Agrupar por año y calcular promedio de successRate
            const grouped = {};

            data.forEach(item => {
                const year = item.academicYear;
                if (!grouped[year]) {
                    grouped[year] = { total: 0, count: 0 };
                }
                grouped[year].total += item.successRate;
                grouped[year].count += 1;
            });

            const categories = Object.keys(grouped).sort(); // orden cronológico
            const successRates = categories.map(year => +(grouped[year].total / grouped[year].count).toFixed(2));

            Highcharts.chart('container', {
                chart: { type: 'area' },
                title: { text: 'Tasa de Éxito Promedio por Año Académico' },
                subtitle: { text: 'Fuente: API https://sos2425-17.onrender.com/api/v2/university-academic-performance' },
                xAxis: {
                    categories,
                    title: { text: 'Año Académico' },
                    tickmarkPlacement: 'on'
                },
                yAxis: {
                    title: { text: 'Tasa de Éxito (%)' },
                    labels: { format: '{value}%' }
                },
                tooltip: {
                    pointFormat: '<b>{point.y:.2f}%</b> de tasa de éxito promedio'
                },
                plotOptions: {
                    area: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: { enabled: true }
                            }
                        }
                    }
                },
                series: [{
                    name: 'Tasa de Éxito Promedio',
                    data: successRates
                }]
            });
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    });
</script>


<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        Demonstrating a basic area chart, also known as a mountain chart.
        Area charts are similar to line charts, but commonly used to visualize
        volumes.
    </p>
</figure>