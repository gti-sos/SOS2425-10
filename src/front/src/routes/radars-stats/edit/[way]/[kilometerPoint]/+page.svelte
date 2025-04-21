<script>
    // Lógica del componente en SvelteKit
    //@ts-nocheck
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"; // Usamos `goto` de SvelteKit para la navegación
    import { page } from '$app/stores'; // Usamos $page para obtener los parámetros de la URL

    let radar = null;
    let way = '';
    let kilometerPoint = '';

    // Mensajes informativos
    let successMessage = '';
    let errorMessage = '';

    // Obtenemos los parámetros directamente desde la URL
    $: way = $page.params.way;
    $: kilometerPoint = $page.params.kilometerPoint;

    // Cargar el radar cuando el componente se monte
    onMount(async () => {
        const res = await fetch(`/api/v1/radars-stats/${encodeURIComponent(way)}/${encodeURIComponent(kilometerPoint)}`);
        console.log(res.body);
        if (res.ok) {
            radar = await res.json();
            
        } else {
            console.log("Error fetching radar:", res.status);
            errorMessage = `No existe un radar con way: ${way} y kilometerPoint: ${kilometerPoint}.`;
        }
    });

    // Función para actualizar los datos del radar
    async function updateRadar() {
        const res = await fetch(`/api/v1/radars-stats/${encodeURIComponent(way)}/${encodeURIComponent(kilometerPoint)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(radar)
        });

        if (res.ok) {
            successMessage = "Radar actualizado correctamente!";
            errorMessage = ''; // Limpiar mensaje de error

            // Mostrar mensaje de éxito antes de redirigir
            setTimeout(() => {
                goto("/radars-stats"); // Redirigir después de la actualización con `goto` de SvelteKit
            }, 2000); // 2 segundos de retraso para mostrar el mensaje
        } else if (res.status === 404) {
            errorMessage = `No se encontró un radar con way: ${way} y kilometerPoint: ${kilometerPoint}.`;
        } else if (res.status === 400) {
            errorMessage = "Datos incorrectos, por favor revisa los valores ingresados.";
        } else if (res.status === 409) {
            errorMessage = "Ya existe un radar con estos datos.";
        } else {
            errorMessage = "Ocurrió un error al actualizar el radar. Intenta nuevamente.";
        }
    }
</script>

<h2>Edit Radar</h2>

{#if radar}
    <form on:submit|preventDefault={updateRadar}>
        <label for="autonomousCommunity">Autonomous Community</label>
        <input id="autonomousCommunity" type="text" bind:value={radar.autonomousCommunity} />

        <label for="province">Province</label>
        <input id="province" type="text" bind:value={radar.province} />

        <label for="way">Way</label>
        <input id="way" type="text" bind:value={radar.way} disabled />

        <label for="kilometerPoint">Kilometer Point</label>
        <input id="kilometerPoint" type="number" bind:value={radar.kilometerPoint} disabled />

        <label for="complaint">Complaint</label>
        <input id="complaint" type="number" bind:value={radar.complaint} />

        <label for="year">Year</label>
        <input id="year" type="number" bind:value={radar.year} />

        <label for="speedEstimation">Speed Estimation</label>
        <input id="speedEstimation" type="number" bind:value={radar.speedEstimation} />

        <label for="averageSpeedFined">Average Speed Fined</label>
        <input id="averageSpeedFined" type="number" bind:value={radar.averageSpeedFined} />

        <button type="submit">Save Changes</button>
    </form>
{/if}

<!-- Mensajes de éxito o error -->
{#if successMessage}
    <p class="success-message">{successMessage}</p>
{/if}

{#if errorMessage}
    <p class="error-message">{errorMessage}</p>
{/if}

<style>
    .success-message {
        color: green;
        font-weight: bold;
        margin-top: 10px;
    }

    .error-message {
        color: red;
        font-weight: bold;
        margin-top: 10px;
    }
</style>
