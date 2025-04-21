<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from '$app/stores';

    let registration = null;
    let id = '';

    let successMessage = '';
    let errorMessage = '';

    $: id = $page.params.total_general_national;

    onMount(async () => {
        const res = await fetch(`/api/v1/registrations-stats/${id}`);
        if (res.ok) {
            registration = await res.json();
        } else {
            console.log("Error fetching registro:", res.status);
            errorMessage = `No existe un registro con código: ${id}`;
        }
    });

    async function updateRegistration() {

        
        
        const res = await fetch(`/api/v1/registrations-stats/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registration)
        });
        

        if (res.ok) {
            successMessage = "Registro actualizado correctamente ✅";
            errorMessage = '';
            setTimeout(() => {
                goto("/registrations-stats");
            }, 2000);
        } else if (res.status === 404) {
            errorMessage = `No se encontró un registro con código: ${id}`;
        } else if (res.status === 400) {
            errorMessage = "Datos incorrectos, por favor revisa los valores ingresados.";
        } else if (res.status === 409) {
            errorMessage = "Ya existe un registro con estos datos.";
        } else {
            errorMessage = "Ocurrió un error al actualizar el registro. Intenta nuevamente.";
        }
    }
</script>

<h2>Editar Registro</h2>

{#if registration}
    <form on:submit|preventDefault={updateRegistration}>
        <label for="year">Año</label>
        <input id="year" type="number" bind:value={registration.year} />

        <label for="province">Provincia</label>
        <input id="province" type="text" bind:value={registration.province} />

        <label for="total_general_national">Total Nacional</label>
        <input id="total_general_national" type="number" bind:value={registration.total_general_national} disabled />

        <label for="total_general_import">Total Importado</label>
        <input id="total_general_import" type="number" bind:value={registration.total_general_import} />

        <label for="total_general_auction">Total Subasta</label>
        <input id="total_general_auction" type="number" bind:value={registration.total_general_auction} />

        <label for="total_general">Total General</label>
        <input id="total_general" type="number" bind:value={registration.total_general} />

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