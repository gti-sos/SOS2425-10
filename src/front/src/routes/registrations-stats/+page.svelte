<svelte:head>
    <title>
        REGISTRATIONS STATS
    </title>
</svelte:head>

<h2> Registrations Stats Table</h2>

<script>
// @ts-nocheck
import { dev } from "$app/environment";
import { goto } from "$app/navigation";
import { onMount } from "svelte";
import { Button, Table } from '@sveltestrap/sveltestrap';

let PROD_HOST = "";
let DEVEL_HOST = "http://localhost:16079";
let API = "/api/v1/registrations-stats";
if (dev)
    API = DEVEL_HOST + API;

let JAM = [];
let result = "";
let resultStatus = "";
let newYear = "";
let newProvince = "";
let newTotal_general_national = "";
let newTotal_general_import = "";
let newTotal_general_auction = "";
let newTotal_general = "";

let filters = {
    year: '',
    province: '',
    total_general_national: '',
    total_general_import: '',
    total_general_auction: '',
    total_general: '',
    from: '',
    to: ''
};

function goToEdit(nationalId) {
    goto(`/registrations-stats/edit/${nationalId}`);
}

async function getRegistrationsStats() {
    resultStatus = result = "";
    try {
        const params = new URLSearchParams();
        for (const key in filters) {
            if (filters[key] !== '') {
                params.append(key, filters[key]);
            }
        }

        const res = await fetch(`${API}?${params.toString()}`, { method: "GET" });
        const data = await res.json();
        JAM = data;
    } catch (error) {
        console.log(`ERROR getting data from ${API}: ${error}`);
    }
}

async function deleteRegistration(total_general_national) {
    resultStatus = result = "";
    try {
        const res = await fetch(`${API}/${total_general_national}`, { method: "DELETE" });
        const status = await res.status;
        resultStatus = status;
        if (status === 200) {
            console.log(`Registration ${total_general_national} deleted`);
            getRegistrationsStats();
        } else {
            console.log(`ERROR deleting registration ${total_general_national}: status received\n${status}`);
        }
    } catch (error) {
        console.log(`ERROR: DELETE from ${API}: ${error}`);
    }
}

async function createRegistration() {
    resultStatus = result = "";
    try {
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                year: Number(newYear),
                province: newProvince,
                total_general_national: Number(newTotal_general_national),
                total_general_import: Number(newTotal_general_import),
                total_general_auction: Number(newTotal_general_auction),
                total_general: Number(newTotal_general)
            })
        });

        const status = await res.status;
        resultStatus = status;
        if (status === 201) {
            console.log(`Registration created`);
            getRegistrationsStats();
        } else {
            console.log(`Error creating registration:\n ${status}`);
        }
    } catch (error) {
        console.log(`ERROR getting data from ${API}: ${error}`);
    }
}

async function deleteAllRegistrations() {
    const res = await fetch(API, { method: "DELETE" });
    if (res.status === 200) {
        await getRegistrationsStats();
    }
}

async function loadInitialData() {
    const res = await fetch(`${API}/loadInitialData`);
    const status = res.status;
    if (status === 201 || status === 200) {
        console.log("Datos cargados correctamente");
        await getRegistrationsStats();
    } else if (status === 400) {
        console.log("Los datos ya estaban cargados");
    } else {
        const errorText = await res.text();
        console.error("Error:", status, errorText);
    }
}

onMount(async () => {
    getRegistrationsStats();
});
</script>

<div>
    <h4>Filtros</h4>
    <input placeholder="year" bind:value={filters.year}>
    <input placeholder="province" bind:value={filters.province}>
    <input placeholder="total_general_national" bind:value={filters.total_general_national}>
    <input placeholder="total_general_import" bind:value={filters.total_general_import}>
    <input placeholder="total_general_auction" bind:value={filters.total_general_auction}>
    <input placeholder="total_general" bind:value={filters.total_general}>
    <input placeholder="from (year)" bind:value={filters.from}>
    <input placeholder="to (year)" bind:value={filters.to}>
    <Button on:click={getRegistrationsStats}>Buscar</Button>
</div>

<Table>
    <thead>
        <tr>
            <th>year</th>
            <th>province</th>
            <th>total_general_national</th>
            <th>total_general_import</th>
            <th>total_general_auction</th>
            <th>total_general</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td><input bind:value={newYear}></td>
            <td><input bind:value={newProvince}></td>
            <td><input bind:value={newTotal_general_national}></td>
            <td><input bind:value={newTotal_general_import}></td>
            <td><input bind:value={newTotal_general_auction}></td>
            <td><input bind:value={newTotal_general}></td>
            <td>
                <Button color="secondary" on:click={createRegistration}>Crear Registro</Button>
            </td>
        </tr>

        {#each JAM as dato}
        <tr>
            <td>{dato.year}</td>
            <td>{dato.province}</td>
            <td>{dato.total_general_national}</td>
            <td>{dato.total_general_import}</td>
            <td>{dato.total_general_auction}</td>
            <td>{dato.total_general}</td>
            <td>
                <Button color="warning" on:click={() => goToEdit(dato.total_general_national)}>Editar</Button>
                <Button color="danger" on:click={() => deleteRegistration(dato.total_general_national)}>Borrar</Button>
            </td>
        </tr>
        {/each}

        <tr>
            <td colspan="7">
                <Button color="danger" on:click={deleteAllRegistrations}>Borrar todos</Button>
                <Button color="secondary" on:click={loadInitialData}>Cargar datos iniciales</Button>
            </td>
        </tr>
    </tbody>
</Table>