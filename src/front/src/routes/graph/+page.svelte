<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/series-label.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>


</svelte:head>

<style>
    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 360px;
        max-width: 800px;
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
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/radars-stats/";
    if (dev) API = DEVEL_HOST + API;
    

    /**
	 * @type {never[]}
	 */
    let radars = [];
    let result = "";
    let resultStatus = "";

    // Variables para los filtros
    let filterCommunity = '';
    let filterProvince = '';
    let filterWay = '';
    let filterKilometerPoint = '';
    let filterComplaint = '';
    let filterYear = '';
    let filterSpeedEstimation = '';
    let filterAverageSpeedFined = '';

    // Mensaje de estado de operación
    let statusMessage = "";
    let noResultsMessage = "";
    let filterStatusMessage = ""; // Nueva variable para los mensajes de filtro

    // Función para obtener los radars con los filtros
    async function getData() {
        resultStatus = result = "";
        try {

            const res = await fetch(API, { method: "GET" });
                const data = await res.json();
                radars = data;
                console.log(`Response received:\n${JSON.stringify(radars,null,2)}`);
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
            statusMessage = "Hubo un problema al obtener los radars. Por favor, intenta de nuevo.";
            setTimeout(() => {
                statusMessage = ""; // Limpiar el mensaje después de 2 segundos
            }, 2000);
        }
    }
    onMount(async () => {
    await getData();

    const chartData = radars.map((radar) => ({
        name: radar.province + " (" + radar.way + ")",
        y: radar.complaint
    }));

    Highcharts.chart('container', {
        title: {
            text: 'Denuncias por radar',
            align: 'left'
        },
        yAxis: {
            title: {
                text: 'Cantidad de denuncias'
            }
        },
        xAxis: {
            type: 'category'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: [{
            name: 'Denuncias',
            data: chartData
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
});

</script>
<figure class="highcharts-figure">
    <div id="container"></div>
    
</figure>