<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { goto } from '$app/navigation';

    let registration = {
        year: '',
        province: '',
        total_general_national: 0,
        total_general_import: '',
        total_general_auction: '',
        total_general: ''
    };

    let API = "/api/v1/registrations-stats";
    if (dev) API = "http://localhost:16079" + API;

    let id = "";
    $: id = $page.params.total_general_national;

    onMount(async () => {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        registration = data;
    });

    async function updateRegistration() {
        registration.total_general_national = Number(id);

        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registration)
        });

        if (res.status === 200) {
            alert("✅ Registro actualizado correctamente");
            goto("/registrations-stats");
        } else if (res.status === 404) {
            alert("❌ No se encontró el registro con ese ID");
        } else if (res.status === 400) {
            alert("⚠️ El ID en el body no coincide con la URL");
        } else {
            alert("❌ Error al actualizar el registro");
        }
    }
</script>

<h2>Editar Registro {id}</h2>

<form on:submit|preventDefault={updateRegistration}>
    <label>Año: <input type="number" bind:value={registration.year}></label><br>
    <label>Provincia: <input bind:value={registration.province}></label><br>
    <label>Total Nacional: <input bind:value={registration.total_general_national}></label><br>
    <label>Total Importado: <input bind:value={registration.total_general_import}></label><br>
    <label>Total Subasta: <input bind:value={registration.total_general_auction}></label><br>
    <label>Total General: <input bind:value={registration.total_general}></label><br>

    <button type="submit">Guardar</button>
</form>