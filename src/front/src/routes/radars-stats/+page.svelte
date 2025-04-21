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
    let noResultsMessage = "";

    // Función para obtener los radars con los filtros
    // async function getRadars() {
    //     resultStatus = result = "";
    //     try {
    //         const queryParams = new URLSearchParams({
    //             autonomousCommunity: filterCommunity,
    //             province: filterProvince,
    //             way: filterWay,
    //             kilometerPoint: filterKilometerPoint,
    //             complaint: filterComplaint,
    //             year: filterYear,
    //             speedEstimation: filterSpeedEstimation,
    //             averageSpeedFined: filterAverageSpeedFined,
    //         });

    //         const res = await fetch(`${API}?${queryParams}`, { method: "GET" });
    //         const data = await res.json();
    //         radars = data;

    //         if (res.status!==200){
    //             statusMessage = "No hay radares con ese filtro"
    //             setTimeout(() => {
    //                 statusMessage = ""
    //             }, 2000);
                
    //         }else{
    //             statusMessage = "Radares Mostrados"
    //             setTimeout(() => {
    //                 statusMessage = ""
    //             }, 2000);
    //         }

    //         // Verificar si no hay resultados
    //         if (radars.length === 0) {
    //             noResultsMessage = "No se encontraron radars con los filtros aplicados.";
    //         } else {
    //             noResultsMessage = "";
    //         }
           
            

    //         console.log(`Response received:\n ${JSON.stringify(radars, null, 2)}`);
    //     } catch (error) {
    //         console.log(`ERROR: GET from ${API}: ${error}`);
    //         statusMessage = "Hubo un problema al obtener los radars. Por favor, intenta de nuevo.";
    //     }
    // }
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

            // Si la respuesta no es 200, asignar mensaje de error
            if (res.status === 404) { statusMessage = "No se encontraron radares, o han sido eliminados"
             setTimeout(() => {
                    statusMessage = ""
                }, 2000);}
            if (res.status === 200) {statusMessage = "Aplicado Correctamente"
                setTimeout(() => {
                        statusMessage = ""
                    }, 2000);
                }
            const data = await res.json();
            radars = data;

                

            //     console.log(`Response received:\n ${JSON.stringify(radars, null, 2)}`);
            // }
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
            statusMessage = "Hubo un problema al obtener los radars. Por favor, intenta de nuevo.";
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
                statusMessage = "¡Radar creado correctamente!";
                getRadars();
            } else {
                statusMessage = "Hubo un error al intentar crear el radar. Por favor, inténtalo nuevamente.";
            }
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
            statusMessage = "Hubo un problema al crear el radar. Inténtalo de nuevo.";
        }
    }

    async function deleteRadar(way, kilometerPoint) {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/${encodeURIComponent(way)}/${encodeURIComponent(kilometerPoint)}`, { method: "DELETE" });
            const status = await res.status;
            resultStatus = status;
            if (status == 200) {
                statusMessage = `¡Radar ${way}, ${kilometerPoint} eliminado correctamente!`;
                getRadars();
            } else {
                statusMessage = `Error al eliminar el radar ${way}, ${kilometerPoint}. Puede que no exista.`;
            }
        } catch (error) {
            console.log(`ERROR: GET from ${API}: ${error}`);
            statusMessage = "Error al intentar eliminar el radar. Inténtalo nuevamente.";
        }
    }

    async function deleteAllRadars() {
    const res = await fetch(API, { method: "DELETE" });
    
    if (res.status === 200) {
        statusMessage = "¡Todos los radars han sido eliminados!";
        setTimeout(() => {
            statusMessage = "";
        }, 2000);
    } else if (res.status === 404) {
        statusMessage = "No se encontraron radares para eliminar.";
        setTimeout(() => {
            statusMessage = "";
        }, 2000);
    } else {
        statusMessage = "Hubo un problema al intentar eliminar todos los radares.";
        setTimeout(() => {
            statusMessage = "";
        }, 2000);
    }
    await getRadars();
}


    async function loadInitialData() {
        const res = await fetch(`${API}/loadInitialData`);
        const status = res.status;
        if (status === 201 || status === 200) {
            statusMessage = "¡Datos cargados correctamente!";
            await getRadars();
        } else if (status === 400) {
            statusMessage = "Los datos ya estaban cargados.";
        } else {
            const errorText = await res.text();
            console.error("Error:", status, errorText);
            statusMessage = "Hubo un problema al cargar los datos iniciales.";
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

<!-- Mensaje de estado -->
{#if statusMessage}
    <div class="alert alert-info">{statusMessage}</div>
{/if}

<!-- Mensaje de resultados vacíos -->
{#if noResultsMessage}
    <div class="alert alert-warning">{noResultsMessage}</div>
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
        <tr>
            <td><input bind:value={newRadarCommunity}></td>
            <td><input bind:value={newRadarProvince}></td>
            <td><input bind:value={newRadarWay}></td>
            <td><input bind:value={newRadarKilometerPoint}></td>
            <td><input bind:value={newRadarComplaint}></td>
            <td><input bind:value={newRadarYear}></td>
            <td><input bind:value={newRadarSpeedEstimation}></td>
            <td><input bind:value={newRadarAverageSpeedFined}></td>
            <td>
                <Button color="secondary" on:click={createRadar}>Crear Radar</Button>
            </td>
        </tr>
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
                <Button color="danger" on:click={() => deleteRadar(radar.way, radar.kilometerPoint)}>Eliminar</Button>
                <Button color="warning" on:click={() => goToEdit(radar.way, radar.kilometerPoint)}>Editar</Button>
            </td>
        </tr>
        {/each}
        <tr>
            <td colspan="9">
                <Button color="danger" on:click={deleteAllRadars}>Eliminar Todos</Button>
                <Button color="secondary" on:click={loadInitialData}>Cargar Datos Iniciales</Button>
            </td>
        </tr>
    </tbody>
</Table>

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
