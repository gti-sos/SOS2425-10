<svelte:head>
    <title>
      ACCIDENTS STATS
    </title>
</svelte:head>

<h2> Accidents Stats Table</h2>

<script>
// @ts-nocheck
import { dev } from "$app/environment";
import { onMount } from "svelte";
import { Button, Table } from '@sveltestrap/sveltestrap';
import { goto } from '$app/navigation';

let PROD_HOST = "";
let DEVEL_HOST = "http://localhost:16079";
let API = "/api/v2/accidents-stats";
if (dev) API = DEVEL_HOST + API;

let VCH = [];
let result = "";
let resultStatus = "";
let newAccidentId = "";
let newYear = "";
let newMonth = "";
let newProvince = "";
let newMunicipality_code = "";
let newRoad = "";
let newKm = "";
let newDirection_1f = "";
let newAccidentType = "";
let newTotal_victims = "";
let error = "";

let mensajeUsuario = "";
let tipoMensaje = "";
function mostrarMensaje(texto, tipo = "ok") {
  mensajeUsuario = texto;
  tipoMensaje = tipo;
  setTimeout(() => mensajeUsuario = "", 3000);
}

let filters = {
  accident_id: '', province: '', municipality_code: '', road: '', km: '',
  year: '', month: '', direction_1f: '', accident_type: '', total_victims: '', from: '', to: ''
};

function goToEdit(accidentId) {
  goto(`/accidents-stats/edit/${accidentId}`);
}

async function getAccidentsStats() {
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
    result = JSON.stringify(data, null, 2);
    VCH = data;
  } catch (error) {
    mostrarMensaje("❌ Error al obtener los accidentes", "error");
  }
}
//---

async function deleteAccident(accident_id) {
  resultStatus = result = "";
  try {
    const res = await fetch(`${API}/${accident_id}`, { method: "DELETE" });
    const status = await res.status;
    resultStatus = status;

    if (status === 200) {
      mostrarMensaje(`✅ Accidente ${accident_id} eliminado correctamente`, "ok");
      getAccidentsStats();
    } else {
      mostrarMensaje("❌ Error al eliminar el accidente", "error");
    }
  } catch (error) {
    mostrarMensaje("❌ Error de conexión al intentar eliminar", "error");
  }
}

async function createAccident() {
  resultStatus = result = "";
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accident_id: Number(newAccidentId),
        year: newYear, month: newMonth, province: newProvince,
        municipality_code: newMunicipality_code, road: newRoad, km: newKm,
        direction_1f: newDirection_1f, accident_type: newAccidentType,
        total_victims: newTotal_victims
      })
    });

    const status = await res.status;
    resultStatus = status;
    if (status === 201) {
      mostrarMensaje("✅ Accidente creado correctamente", "ok");
      getAccidentsStats();
    } else if (status === 400) {
      mostrarMensaje("⚠️ Faltan datos obligatorios", "error");
    } else if (status === 409) {
      mostrarMensaje("⚠️ Ya existe un accidente con ese ID", "error");
    } else {
      mostrarMensaje("❌ Error al crear el accidente", "error");
    }
  } catch (error) {
    mostrarMensaje("❌ Error de conexión al crear accidente", "error");
  }
}

async function deleteAllAccidents() {
  const res = await fetch(API, { method: "DELETE" });
  if (res.status === 200) {
    mostrarMensaje("✅ Todos los accidentes han sido eliminados", "ok");
    await getAccidentsStats();
  } else {
    mostrarMensaje("❌ Error al eliminar todos los accidentes", "error");
  }
}

async function loadInitialData() {
  const res = await fetch(`${API}/loadInitialData`);
  const status = res.status;

  if (status === 201 || status === 200) {
    mostrarMensaje("✅ Datos iniciales cargados correctamente", "ok");
    await getAccidentsStats();
  } else if (status === 400) {
    mostrarMensaje("⚠️ Los datos ya estaban cargados", "error");
  } else {
    mostrarMensaje("❌ Error al cargar los datos iniciales", "error");
  }
}

onMount(async () => {
  getAccidentsStats();
});
</script>

{#if mensajeUsuario}
  <div class={tipoMensaje === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>
    {mensajeUsuario}
  </div>
{/if}

<div>
    <h4>Filtros</h4>
    <input placeholder="accident_id" bind:value={filters.accident_id}>
    <input placeholder="province" bind:value={filters.province}>
    <input placeholder="municipality_code" bind:value={filters.municipality_code}>
    <input placeholder="road" bind:value={filters.road}>
    <input placeholder="km" bind:value={filters.km}>
    <input placeholder="year" bind:value={filters.year}>
    <input placeholder="month" bind:value={filters.month}>
    <input placeholder="direction_1f" bind:value={filters.direction_1f}>
    <input placeholder="accident_type" bind:value={filters.accident_type}>
    <input placeholder="total_victims" bind:value={filters.total_victims}>
    <input placeholder="from (year)" bind:value={filters.from}>
    <input placeholder="to (year)" bind:value={filters.to}>
    <Button on:click={getAccidentsStats}>Buscar</Button>
</div>

<Table>
<thead>
  <tr>
    <th>accident_id</th><th>year</th><th>month</th><th>province</th><th>municipality_code</th>
    <th>road</th><th>km</th><th>direction_1f</th><th>accident_type</th><th>total_victims</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><input bind:value={newAccidentId}></td>
    <td><input bind:value={newYear}></td>
    <td><input bind:value={newMonth}></td>
    <td><input bind:value={newProvince}></td>
    <td><input bind:value={newMunicipality_code}></td>
    <td><input bind:value={newRoad}></td>
    <td><input bind:value={newKm}></td>
    <td><input bind:value={newDirection_1f}></td>
    <td><input bind:value={newAccidentType}></td>
    <td><input bind:value={newTotal_victims}></td>
    <td>
      <Button color="secondary" on:click={createAccident}>Crear Accidente</Button>
    </td>
  </tr>

  {#each VCH as dato}
  <tr>
    <td>{dato.accident_id}</td>
    <td>{dato.year}</td>
    <td>{dato.month}</td>
    <td>{dato.province}</td>
    <td>{dato.municipality_code}</td>
    <td>{dato.road}</td>
    <td>{dato.km}</td>
    <td>{dato.direction_1f}</td>
    <td>{dato.accident_type}</td>
    <td>{dato.total_victims}</td>
    <td>
      <Button color="warning" on:click={() => goToEdit(dato.accident_id)}>Editar</Button>
      <Button color="danger" on:click={() => deleteAccident(dato.accident_id)}>Borrar</Button>
    </td>
  </tr>
  {/each}

  <tr><td colspan="11">
    <Button color="danger" on:click={deleteAllAccidents}>Borrar todos</Button>
    <Button color="secondary" on:click={loadInitialData}>Cargar datos iniciales</Button>
  </td></tr>
</tbody>
</Table>

<style>
  .mensaje-ok {
    background-color: #d4edda;
    border: 1px solid #28a745;
    color: #155724;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
  }

  .mensaje-error {
    background-color: #f8d7da;
    border: 1px solid #dc3545;
    color: #721c24;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
  }
</style>