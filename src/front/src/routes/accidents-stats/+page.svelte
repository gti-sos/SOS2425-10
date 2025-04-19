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

let stats = [];
let filters = {
  accident_id: '',
  province: '',
  municipality_code: '',
  road: '',
  km: '',
  year: '',
  month: '',
  direction_1f: '',
  accident_type: '',
  total_victims: '',
  from: '',
  to: ''
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
    console.log("🔍 status:", res.status);
    const data = await res.json();
    console.log("📦 Resultado:", data);
    result = JSON.stringify(data, null, 2);
    VCH = data;
    console.log(`Response received:\n ${JSON.stringify(VCH, null, 2)}`);
  } catch (error) {
    console.log(`ERROR getting data from ${API}: ${error}`);
  }
}

async function deleteAccident(accident_id) {
  resultStatus = result = "";
  try {
    const res = await fetch(API + "/" + accident_id, { method: "DELETE" });

    const status = await res.status;
    resultStatus = status;

    if (status == 200) {
      console.log(`Accident ${accident_id} deleted`);
      getAccidentsStats();
    } else {
      console.log(`ERROR deleting accident ${accident_id}: status received\n${status}`);
    }
  } catch (error) {
    console.log(`ERROR: GET from ${API}: ${error}`);
  }
}

async function createAccident() {
  resultStatus = result = "";
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    if (status == 201) {
      console.log(`Accident created`);
      getAccidentsStats();
    } else {
      console.log(`Error creating accident:\n ${status}`);
    }
  } catch (error) {
    console.log(`ERROR getting data from ${API}: ${error}`);
  }
}

async function deleteAllAccidents() {
  const res = await fetch(API, { method: "DELETE" });
  if (res.status === 200) {
    await getAccidentsStats();
  }
}

async function loadInitialData() {
  const res = await fetch(`${API}/loadInitialData`);
  const status = res.status;

  if (status === 201 || status === 200) {
    console.log("Datos cargados correctamente");
    await getAccidentsStats();
  } else if (status === 400) {
    console.log("Los datos ya estaban cargados");
  } else {
    const errorText = await res.text();
    console.error("Error:", status, errorText);
  }
}

onMount(async () => {
  getAccidentsStats();
});
</script>

<h2>Accidents Stats Table</h2>

<div>
  <h4>Filtros</h4>
  <input placeholder="accident_id" bind:value={filters.accident_id}>
  <input placeholder="province" bind:value={filters.province}>
  <input placeholder="municipality_code" bind:value={filters.municipality_code}>
  <input placeholder="road" bind:value={filters.road}>
  <input placeholder="km" bind:value={filters.k
