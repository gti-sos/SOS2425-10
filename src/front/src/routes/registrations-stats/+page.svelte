<svelte:head>
    <title>
        REGISTRATIONS STATS
    </title>
</svelte:head>

<h2> Tabla de Matriculaciones</h2>

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
    to: '',
    limit:'',
    offset:''
};

let mensajeUsuario = "";
let tipoMensaje = ""; // "ok" o "error"

function mostrarMensaje(texto, tipo = "ok") {
    mensajeUsuario = texto;
    tipoMensaje = tipo;
    setTimeout(() => mensajeUsuario = "", 3000);
}

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
        const status = res.status;

        if (status === 200) {
            const data = await res.json();
            JAM = data;
        }  else if (status === 400) {
            mostrarMensaje("⚠️ Error en los parámetros de búsqueda. Revisa los valores introducidos.", "error");
        } else if (status === 404) {
            mostrarMensaje("❌ No se encontró ningún registro con los criterios introducidos", "error");
        } else {
            mostrarMensaje(`❌ Error inesperado al buscar: código ${status}`, "error");
        }

    } catch (error) {
        mostrarMensaje("❌ Error de conexión al realizar la búsqueda", "error");
    }
}

async function deleteRegistration(total_general_national) {
    resultStatus = result = "";
    try {
        const res = await fetch(`${API}/${total_general_national}`, { method: "DELETE" });
        const status = await res.status;
        resultStatus = status;
        if (status === 200) {
            mostrarMensaje(`✅ Registro con código ${total_general_national} eliminado correctamente`, "ok");
            getRegistrationsStats();
        } else if (status === 404) {
            mostrarMensaje(`❌ No se encontró el registro con código ${total_general_national}`, "error");
        } else {
            mostrarMensaje("❌ Error al eliminar el registro", "error");
        }
    } catch (error) {
        mostrarMensaje("❌ Error de conexión al intentar eliminar", "error");
    }
}

async function createRegistration() {
  resultStatus = result = "";

  //Validación: comprobar que todos los campos están rellenos 
  if (
    !newYear || !newProvince  ||!newTotal_general_national|| 
    !newTotal_general_import || !newTotal_general_auction || !newTotal_general
  ) {
    mostrarMensaje("⚠️ Todos los campos son obligatorios. Por favor, complétalos.", "error");
    return;
  }

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
      mostrarMensaje("✅ Registro creado correctamente", "ok");
      getRegistrationsStats();
    } else if (status === 400) {
      mostrarMensaje("⚠️ Datos inválidos o faltantes. Revisa los campos.", "error");
    } else if (status === 409) {
      mostrarMensaje("⚠️ Ya existe un registro con ese identificador", "error");
    } else {
      mostrarMensaje("❌ Error al crear el registro", "error");
    }

  } catch (error) {
    mostrarMensaje("❌ Error de conexión al intentar crear registro", "error");
  }
}

async function funcionFiltro() {
  await getRegistrationsStats()
  if (JAM.length === 0) {
    mostrarMensaje("⚠️ No se encontraron matriculaciones con esos filtros", "error");
  } else {
    mostrarMensaje("✅ Búsqueda realizada correctamente", "ok");
      }


}

async function deleteAllRegistrations() {
    const res = await fetch(API, { method: "DELETE" });
    if (res.status === 200) {
    if (JAM.length === 0){
      mostrarMensaje("❌ Los datos ya estan borrados", "ok");
    }else if(!(JAM.length === 0)){
      mostrarMensaje("✅ Todos los accidentes han sido eliminados", "ok");
    }
        await getRegistrationsStats();
    } else {
        mostrarMensaje("❌ Error al eliminar todos los registros", "error");
    }
}

async function loadInitialData() {
    const res = await fetch(`${API}/loadInitialData`);
    const status = res.status;
    if (status === 201 || status === 200) {
        mostrarMensaje("✅ Datos iniciales cargados correctamente", "ok");
        await getRegistrationsStats();
    } else if (status === 400) {
        mostrarMensaje("⚠️ Los datos ya estaban cargados", "error");
    } else {
        mostrarMensaje("❌ Error al cargar los datos iniciales", "error");
    }
}

onMount(async () => {
    getRegistrationsStats();
});
</script>

{#if mensajeUsuario}
  <div class={tipoMensaje === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>
    {mensajeUsuario}
  </div>
{/if}

<div>
    <h4>Buscar registros</h4>
    <input placeholder="Año" bind:value={filters.year}>
    <input placeholder="Provincia" bind:value={filters.province}>
    <input placeholder="Total nacional" bind:value={filters.total_general_national}>
    <input placeholder="Total importado" bind:value={filters.total_general_import}>
    <input placeholder="Total subasta" bind:value={filters.total_general_auction}>
    <input placeholder="Total general" bind:value={filters.total_general}>
    <input placeholder="Desde (año)" bind:value={filters.from}>
    <input placeholder="Hasta (año)" bind:value={filters.to}>
    <input placeholder="Límite (limit)" bind:value={filters.limit}>
    <input placeholder="Desplazamiento (offset)" bind:value={filters.offset}>
    <Button on:click={funcionFiltro}>Buscar</Button>
</div>

<Table>
    <thead>
        <tr>
            <th>Año</th>
            <th>Provincia</th>
            <th>Total Nacional</th>
            <th>Total Importado</th>
            <th>Total Subasta</th>
            <th>Total General</th>
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