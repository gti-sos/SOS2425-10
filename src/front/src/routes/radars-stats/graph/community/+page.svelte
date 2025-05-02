<svelte:head>
    <script nonce="undefined" src="https://cdn.zingchart.com/zingchart.min.js"></script>


</svelte:head>

<style>
    .chart--container {
      height: 100%;
      width: 100%;
      min-height: 530px;
    }

    .zc-ref {
      display: none;
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

    // Agrupar denuncias por Comunidad Autónoma
    const communityDataMap = {};

    radars.forEach(radar => {
        const community = radar.autonomousCommunity;

        if (!communityDataMap[community]) {
            communityDataMap[community] = 0;
        }
        communityDataMap[community] += radar.complaint;
    });

    // Preparar datos para ZingChart
    const communities = Object.keys(communityDataMap);
    const complaints = Object.values(communityDataMap);

    const chartConfig = {
        type: 'bar',
        title: {
            text: 'Denuncias por Comunidad Autónoma'
        },
        scaleX: {
            labels: communities
        },
        scaleY: {
            label: {
                text: 'Cantidad de denuncias'
            }
        },
        series: [
            {
                values: complaints
            }
        ]
    };

    zingchart.render({
        id: 'myChart',
        data: chartConfig,
        height: '100%',
        width: '100%'
    });
});


</script>
<div id="myChart" class="chart--container"><a class="zc-ref" href="https://www.zingchart.com/">Powered by ZingChart</a></div>