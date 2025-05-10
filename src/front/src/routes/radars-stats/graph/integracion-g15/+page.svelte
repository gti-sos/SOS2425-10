<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>

<style>
    .highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
    max-width: 660px;
    margin: 1em auto;
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

    const API = "https://sos2425-15.onrender.com/api/v1/temperature-stats/";

    onMount(async () => {
        try {
            const res = await fetch(API);
            const allData = await res.json();

            // Filtrar solo el año 2023 (puedes cambiarlo)
            const year = 2023;
            const dataFiltered = allData.filter(d => d.year === year);

            // Preparar datos para el pie chart
            const chartData = dataFiltered.map(d => ({
                name: d.province,
                y: d.average_temperature
            }));

            // Calcular total para mostrarlo en el centro
            const total = chartData.reduce((sum, p) => sum + p.y, 0).toFixed(1);

            // Crear gráfico
            Highcharts.chart('container', {
                chart: {
                    type: 'pie',
                    custom: {},
                    events: {
                        render() {
                            const chart = this;
                            const series = chart.series[0];
                            let customLabel = chart.options.chart.custom.label;

                            if (!customLabel) {
                                customLabel = chart.options.chart.custom.label =
                                    chart.renderer.label(`Total<br/><strong>${total} °C</strong>`)
                                        .css({ color: '#000', textAnchor: 'middle' })
                                        .add();
                            }

                            const x = series.center[0] + chart.plotLeft;
                            const y = series.center[1] + chart.plotTop - (customLabel.attr('height') / 2);

                            customLabel.attr({ x, y });
                            customLabel.css({ fontSize: `${series.center[2] / 12}px` });
                        }
                    }
                },
                accessibility: {
                    point: {
                        valueSuffix: ' °C'
                    }
                },
                title: {
                    text: `Temperatura media por provincia - ${year}`
                },
                subtitle: {
                    text: 'Fuente: API Temperature Stats'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y} °C</b> ({point.percentage:.0f}%)'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        borderRadius: 8,
                        dataLabels: [{
                            enabled: true,
                            distance: 20,
                            format: '{point.name}'
                        }, {
                            enabled: true,
                            distance: -15,
                            format: '{point.percentage:.0f}%',
                            style: { fontSize: '0.9em' }
                        }],
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Temperatura media',
                    colorByPoint: true,
                    innerSize: '75%',
                    data: chartData
                }]
            });
        } catch (error) {
            console.error("Error cargando los datos:", error);
        }
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        In Highcharts, pie charts can also feature an empty center, they are
        often referred to as donut charts.
    </p>
</figure>
