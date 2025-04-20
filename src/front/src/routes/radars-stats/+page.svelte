<svelte:head>
    <title>Radars-stats</title>
</svelte:head>

<script>
    //@ts-nocheck
    import { dev } from "$app/environment";
    import { goto } from "$app/navigation";  
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/radars-stats";
    if (dev) API = DEVEL_HOST + API;
    
    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let radars = [];
    let result = "";
    let resultStatus = "";
    let newRadarCommunity, newRadarProvince, newRadarWay, newRadarKilometerPoint;
    let newRadarComplaint, newRadarYear, newRadarSpeedEstimation, newRadarAverageSpeedFined;

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

    // Función para obtener los radars con los filtros
    async function getRadars() {
        resultStatus = result = "";
        try {
            const queryParams = new URLSearchParams({
                autonomousCommunity: filterCommunity,
                province: filterProvince,
                way: filterWay,
                kilometerPoint: filterKilometerPoint,
                complaint: filterComplaint,
                year: filterYear,
                speedEstimation: filterSpeedEstimation,
                averageSpeedFined: filterAverageSpeedFined,
            });

            const res = await fetch(`${API}?${queryParams}`, { method: "GET" });
            const data = await res.json();
            radars = data;
            console.log(`Response received:\n ${JSON.stringify(radars, null, 2)}`);
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
            statusMessage = "Error al obtener los datos. Inténtalo nuevamente.";
        }
    }

    async function createRadar() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    autonomousCommunity: newRadarCommunity,
                    province: newRadarProvince,
                    way: newRadarWay,
                    kilometerPoint: parseFloat(newRadarKilometerPoint),
                    complaint: newRadarComplaint,
                    year: newRadarYear,
                    speedEstimation: newRadarSpeedEstimation,
                    averageSpeedFined: newRadarAverageSpeedFined,
                })
            });

            const status = await res.status;
            resultStatus = status;
            if (status == 201) {
                statusMessage = "Radar creado con éxito!";
                getRadars();
            } else {
                statusMessage = "Error al crear el radar.";
            }
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
            statusMessage = "Error al crear el radar. Inténtalo nuevamente.";
        }
    }

    async function deleteRadar(way, kilometerPoint) {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/${encodeURIComponent(way)}/${encodeURIComponent(kilometerPoint)}`, { method: "DELETE" });
            const status = await res.status;
            resultStatus = status;
            if (status == 200) {
                statusMessage = `Radar ${way}, ${kilometerPoint} eliminado con éxito!`;
                getRadars();
            } else {
                statusMessage = `Error al eliminar el radar ${way}, ${kilometerPoint}.`;
            }
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
            statusMessage = "Error al eliminar el radar. Inténtalo nuevamente.";
        }
    }

    async function deleteAllRadars() {
        const res = await fetch(API, { method: "DELETE" });
        if (res.status === 200) {
            statusMessage = "Todos los radars han sido eliminados.";
            await getRadars();
        } else {
            statusMessage = "Error al eliminar todos los radars.";
        }
    }

    async function loadInitialData() {
        const res = await fetch(`${API}/loadInitialData`);
        const status = res.status;
        if (status === 201 || status === 200) {
            statusMessage = "Datos cargados correctamente.";
            await getRadars();
        } else if (status === 400) {
            statusMessage = "Los datos ya estaban cargados.";
        } else {
            const errorText = await res.text();
            console.error("Error:", status, errorText);
            statusMessage = "Error al cargar los datos iniciales.";
        }
    }
    function goToEdit(way, kilometerPoint) {
        // Genera la URL de la página de edición con los parámetros
        goto(`/radars-stats/edit/${encodeURIComponent(way)}/${encodeURIComponent(kilometerPoint)}`);
    }
    onMount(async () => {
        getRadars();
    });
</script>

<h2>Radars List</h2>

<!-- Filtros de búsqueda -->
<div>
    <h4>Filtros de Búsqueda</h4>
    <input bind:value={filterCommunity} placeholder="Autonomous Community" />
    <input bind:value={filterProvince} placeholder="Province" />
    <input bind:value={filterWay} placeholder="Way" />
    <input bind:value={filterKilometerPoint} placeholder="Kilometer Point" />
    <input bind:value={filterComplaint} placeholder="Complaint" type="number" />
    <input bind:value={filterYear} placeholder="Year" type="number" />
    <input bind:value={filterSpeedEstimation} placeholder="Speed Estimation" type="number" />
    <input bind:value={filterAverageSpeedFined} placeholder="Average Speed Fined" type="number" />
    <Button color="primary" on:click={getRadars}>Buscar</Button>
</div>

<!-- Mensaje de estado -->
{#if statusMessage}
    <div class="alert alert-info">{statusMessage}</div>
{/if}

<Table>
    <thead>
        <tr>
            <th>Autonomous Community</th>
            <th>Province</th>
            <th>Way</th>
            <th>Kilometer Point</th>
            <th>Complaint</th>
            <th>Year</th>
            <th>Speed Estimation</th>
            <th>Average Speed Fined</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each radars as radar}
        <tr>
            <td>{radar.autonomousCommunity}</td>
            <td>{radar.province}</td>
            <td>{radar.way}</td>
            <td>{radar.kilometerPoint}</td>
            <td>{radar.complaint}</td>
            <td>{radar.year}</td>
            <td>{radar.speedEstimation}</td>
            <td>{radar.averageSpeedFined}</td>
            <td>
                <Button color="danger" on:click={() => deleteRadar(radar.way, radar.kilometerPoint)}>Delete</Button>
                <Button color="warning" on:click={() => goToEdit(radar.way, radar.kilometerPoint)}>Edit</Button>
            </td>
        </tr>
        {/each}
        <tr>
            <td colspan="9">
                <Button color="danger" on:click={deleteAllRadars}>Delete All Radars</Button>
                <Button color="secondary" on:click={loadInitialData}>Load Initial Data</Button>
            </td>
        </tr>
    </tbody>
</Table>
