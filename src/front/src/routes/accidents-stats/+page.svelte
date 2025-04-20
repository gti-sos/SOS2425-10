<svelte:head>
    <title>
      ACCIDENTS STATS
    </title>
</svelte:head>

<h2> Tabla Accidentes</h2>

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
  year: '', month: '', direction_1f: '', accident_type: '', total_victims: '', from: '', to: '', limit:'',offset:''
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
    const status = res.status;

    if (status === 200) {
      const data = await res.json();
      VCH = data;
      if (VCH.length === 0) {
        mostrarMensaje("⚠️ No se encontraron accidentes con esos filtros", "error");
      } else {
        mostrarMensaje("✅ Búsqueda realizada correctamente", "ok");
      }
    } else if (status === 400) {
      mostrarMensaje("⚠️ Error en los filtros. Revisa los valores introducidos.", "error");
    } else if (status === 404) {
      mostrarMensaje("❌ No se encontraron resultados con los criterios introducidos.", "error");
    } else {
      mostrarMensaje(`❌ Error inesperado al buscar: código ${status}`, "error");
    }
  } catch (error) {
    mostrarMensaje("❌ Error de conexión al realizar la búsqueda", "error");
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

  // Validar que todos los campos están completos
  if (
    !newAccidentId || !newYear  || !newMonth ||  !newProvince  ||
    !newMunicipality_code  || !newRoad  || !newKm  || !newDirection_1f  ||
    !newAccidentType || !newTotal_victims
  ) {
    mostrarMensaje("⚠️ Todos los campos son obligatorios. Por favor, complétalos.", "error");
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accident_id: Number(newAccidentId),
        year: newYear,
        month: newMonth,
        province: newProvince,
        municipality_code: newMunicipality_code,
        road: newRoad,
        km: newKm,
        direction_1f: newDirection_1f,
        accident_type: newAccidentType,
        total_victims: newTotal_victims
      })
    });

    const status = await res.status;
    resultStatus = status;

    if (status === 201) {
      mostrarMensaje("✅ Accidente creado correctamente", "ok");
      getAccidentsStats();
    } else if (status === 400) {
      mostrarMensaje("⚠️ Datos inválidos o faltantes. Revisa los campos.", "error");
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
    <input placeholder="ID ACCIDENTE" bind:value={filters.accident_id}>
    <input placeholder="PROVINCIA" bind:value={filters.province}>
    <input placeholder="MUNICIPIO" bind:value={filters.municipality_code}>
    <input placeholder="TRAMO/CAMINO" bind:value={filters.road}>
    <input placeholder="KM" bind:value={filters.km}>
    <input placeholder="AÑO" bind:value={filters.year}>
    <input placeholder="MES" bind:value={filters.month}>
    <input placeholder="DIRECION 1F" bind:value={filters.direction_1f}>
    <input placeholder="TIPO ACCIDENTE" bind:value={filters.accident_type}>
    <input placeholder="TOTAL VICTIMAS" bind:value={filters.total_victims}>
    <input placeholder="DESDE (AÑO)" bind:value={filters.from}>
    <input placeholder="HASTA (AÑO)" bind:value={filters.to}>
    <input placeholder="Límite (limit)" bind:value={filters.limit}>
    <input placeholder="Desplazamiento (offset)" bind:value={filters.offset}>
    <Button on:click={getAccidentsStats}>Buscar</Button>
</div>

<Table>
<thead>
  <tr>
    <th>ID ACCIDENTE</th><th>AÑO</th><th>MES</th><th>PROVINCIA</th><th>MUNICIPIO</th>
    <th>TRAMO/CAMINO</th><th>KM</th><th>DIRECCIÓN 1f</th><th>TIPO ACCIDENTE</th><th>TOTAL VICTIMAS</th>
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