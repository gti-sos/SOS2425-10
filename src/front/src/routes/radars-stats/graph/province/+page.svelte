<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>


</svelte:head>

<style>
    .highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
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

input[type="number"] {
    min-width: 50px;
}

.highcharts-description {
    margin: 0.3rem 10px;
}

</style>
<script>
// @ts-nocheck

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

    // Agrupar denuncias por provincia
    const provinceDataMap = {};

    radars.forEach(radar => {
        const province = radar.province;

        if (!provinceDataMap[province]) {
            provinceDataMap[province] = 0;
        }

        provinceDataMap[province] += radar.complaint;
    });

    // Convertir el objeto a array para Highcharts
    const chartData = Object.entries(provinceDataMap).map(([province, totalComplaints]) => ({
        name: province,
        y: totalComplaints
    }));

    Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Denuncias por Provincia'
        },
        tooltip: {
            valueSuffix: ' denuncias'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: [
                    {
                        enabled: true,
                        distance: 20,
                        format: '{point.name}: {point.y}'
                    },
                    {
                        enabled: true,
                        distance: -40,
                        format: '{point.percentage:.1f}%',
                        style: {
                            fontSize: '1.2em',
                            textOutline: 'none',
                            opacity: 0.7
                        },
                        filter: {
                            operator: '>',
                            property: 'percentage',
                            value: 10
                        }
                    }
                ]
            }
        },
        series: [
            {
                name: 'Denuncias',
                colorByPoint: true,
                data: chartData
            }
        ]
    });
});


</script>
<figure class="highcharts-figure">
    <div id="container"></div>
    
</figure>