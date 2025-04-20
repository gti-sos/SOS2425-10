<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from '$app/stores';
  import { dev } from "$app/environment";
  
  let accident = null;
  let id = '';
  let successMessage = '';
  let errorMessage = '';
  
  let API = "/api/v2/accidents-stats";
  if (dev) API = "http://localhost:16079" + API;
  
  $: id = $page.params.accident_id;
  
  onMount(async () => {
      const res = await fetch(`${API}/${id}`);
      if (res.ok) {
          accident = await res.json();
      } else {
          console.log("Error fetching accidente:", res.status);
          errorMessage = `❌ No existe un accidente con ID: ${id}`;
      }
  });
  
  async function updateAccident() {
      const res = await fetch(`${API}/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(accident)
      });
  
      if (res.ok) {
          successMessage = "✅ Accidente actualizado correctamente";
          errorMessage = '';
          setTimeout(() => {
              goto("/accidents-stats");
          }, 2000);
      } else if (res.status === 404) {
          errorMessage = `❌ No se encontró un accidente con ID: ${id}`;
      } else if (res.status === 400) {
          errorMessage = "⚠️ Datos incorrectos, por favor revisa los valores.";
      } else {
          errorMessage = "❌ Ocurrió un error al actualizar el accidente.";
      }
  }
  </script>
  
  <h2>Editar Accidente #{id}</h2>
  
  {#if accident}
      <form on:submit|preventDefault={updateAccident}>
          <label for="accident_id">ID (no editable)</label>
          <input id="accident_id" type="number" bind:value={accident.accident_id} disabled />
  
          <label for="year">Año</label>
          <input id="year" type="number" bind:value={accident.year} />
  
          <label for="month">Mes</label>
          <input id="month" type="number" bind:value={accident.month} />
  
          <label for="province">Provincia</label>
          <input id="province" type="text" bind:value={accident.province} />
  
          <label for="municipality_code">Código Municipio</label>
          <input id="municipality_code" type="text" bind:value={accident.municipality_code} />
  
          <label for="road">Carretera</label>
          <input id="road" type="text" bind:value={accident.road} />
  
          <label for="km">KM</label>
          <input id="km" type="number" step="any" bind:value={accident.km} />
  
          <label for="direction_1f">Dirección</label>
          <input id="direction_1f" type="number" bind:value={accident.direction_1f} />
  
          <label for="accident_type">Tipo de Accidente</label>
          <input id="accident_type" type="number" bind:value={accident.accident_type} />
  
          <label for="total_victims">Total Víctimas</label>
          <input id="total_victims" type="number" bind:value={accident.total_victims} />
  
          <button type="submit">Guardar cambios</button>
      </form>
  {/if}
  
  {#if successMessage}
      <p class="success-message">{successMessage}</p>
  {/if}
  
  {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
  {/if}
  
  <style>
      form {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
      }
  
      input {
          padding: 0.4rem;
          border-radius: 4px;
          border: 1px solid #ccc;
      }
  
      button {
          margin-top: 1rem;
          padding: 0.5rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
      }
  
      .success-message {
          color: green;
          font-weight: bold;
      }
  
      .error-message {
          color: red;
          font-weight: bold;
      }
  </style>
