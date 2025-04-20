<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { goto } from '$app/navigation';
    let accident = {
    accident_id: 0,
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
    let API = "/api/v1/accidents-stats";
    if (dev) API = "http://localhost:16079/" + API;
  
    //let accident = {};
    let id = "";
  
    $: id = $page.params.accident_id;
  
    onMount(async () => {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();
      accident = data;
    });
  
    async function updateAccident() {
 
      accident.accident_id = Number(id);

      const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify(accident)
      });

      if (res.status === 200) {
        alert("✅ Accidente actualizado correctamente");
        goto("/accidents-stats");
      } else if (res.status === 404) {
        alert("❌ No se encontró el accidente con ese ID");
      } else if (res.status === 400) {
        alert("⚠️ El accident_id en el body no coincide con la URL");
      } else {
        alert("❌ Error al actualizar el accidente");
      }
    }
  </script>
  
  <h2>Editar Accidente {id}</h2>
  
  <form on:submit|preventDefault={updateAccident}>
    <label>Provincia: <input bind:value={accident.province}></label><br>
    <label>Año: <input type="number" bind:value={accident.year}></label><br>
    <label>Mes: <input type="number" bind:value={accident.month}></label><br>
    <label>Municipio: <input bind:value={accident.municipality_code}></label><br>
    <label>Carretera: <input bind:value={accident.road}></label><br>
    <label>KM: <input bind:value={accident.km}></label><br>
    <label>Dirección: <input bind:value={accident.direction_1f}></label><br>
    <label>Tipo de accidente: <input bind:value={accident.accident_type}></label><br>
    <label>Total víctimas: <input bind:value={accident.total_victims}></label><br>
  
    <button type="submit">Guardar</button>
  </form>