<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>



</svelte:head>

<style>
    .highcharts-figure,
.highcharts-data-table table {
    min-width: 310px;
    max-width: 800px;
    margin: 1em auto;
}

#container {
    height: 400px;
}

.highcharts-tooltip h3 {
    margin: 0.3em 0;
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

    const EMPLOYMENT_API = "https://sos2425-14.onrender.com/api/v1/employment-data";
    const RADARS_API = "https://sos2425-10.onrender.com/api/v1/radars-stats";

    onMount(async () => {
        try {
            // Fetch ambos datasets
            const [employmentRes, radarsRes] = await Promise.all([
                fetch(EMPLOYMENT_API),
                fetch(RADARS_API)
            ]);

            const employmentData = await employmentRes.json();
            const radarsData = await radarsRes.json();

            // --- EMPLOYMENT SERIES ---
            const latestEmpYear = Math.max(...employmentData.map(d => d.year));
            const employmentFiltered = employmentData.filter(d => d.year === latestEmpYear);

            const employmentSeries = employmentFiltered.map(item => ({
                x: item.activity_rate,
                y: item.employment_rate,
                z: item.unemployment_rate,
                name: item.province,
                country: item.province
            }));

            // --- RADARS SERIES ---
            const latestRadarYear = Math.max(...radarsData.map(d => d.year));
            const radarsFiltered = radarsData.filter(d => d.year === latestRadarYear);

            const radarsSeries = radarsFiltered.map(item => ({
                x: item.speedEstimation,
                y: item.averageSpeedFined,
                z: item.complaint,
                name: item.province,
                country: `${item.province} (${item.way})`
            }));

            // Crear gráfico combinado
            Highcharts.chart('container', {
                chart: {
                    type: 'bubble',
                    plotBorderWidth: 1,
                    zooming: { type: 'xy' }
                },
                title: {
                    text: 'Datos combinados: Empleo y Radares'
                },
                subtitle: {
                    text: `Últimos datos disponibles (${latestEmpYear} y ${latestRadarYear})`
                },
                xAxis: {
                    title: { text: 'X: Tasa de actividad / Velocidad estimada' },
                    gridLineWidth: 1
                },
                yAxis: {
                    title: { text: 'Y: Tasa de empleo / Velocidad multada promedio' },
                    startOnTick: false,
                    endOnTick: false
                },
                tooltip: {
                    useHTML: true,
                    headerFormat: '<table>',
                    pointFormat:
                        '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                        '<tr><th>X:</th><td>{point.x}</td></tr>' +
                        '<tr><th>Y:</th><td>{point.y}</td></tr>' +
                        '<tr><th>Z:</th><td>{point.z}</td></tr>',
                    footerFormat: '</table>',
                    followPointer: true
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                },
                series: [
                    {
                        name: "Empleo",
                        data: employmentSeries,
                        color: 'rgba(54, 162, 235, 0.5)' // azul
                    },
                    {
                        name: "Radares",
                        data: radarsSeries,
                        color: 'rgba(255, 99, 132, 0.5)' // rojo
                    }
                ]
            });

        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    });
</script>


<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        Este gráfico de burbujas muestra dos conjuntos de datos distintos superpuestos:
        por un lado, información sobre el empleo en las provincias españolas, representada en burbujas azules 
        (donde el eje X indica la tasa de actividad, el eje Y la tasa de empleo y el tamaño refleja la tasa de paro);
        y por otro lado, datos sobre radares de tráfico, representados en burbujas rojas (con el eje X mostrando la velocidad estimada,
        el eje Y la velocidad media de los sancionados y el tamaño indicando el número de denuncias registradas). Aunque se visualizan juntos,
        cada conjunto representa fenómenos diferentes y no deben interpretarse de forma comparativa directa.
    </p>
</figure>