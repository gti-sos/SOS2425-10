
<script>
    // @ts-nocheck
      let query = '';
      let personajes = [];
      let notFound = false;
    
      async function buscarPersonajes() {
        try {
          const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(query.trim())}`;
          const res = await fetch(url);
    
          if (!res.ok) {
            notFound = true;
            personajes = [];
            return;
          }
    
          const data = await res.json();
          personajes = data.results ?? [];
          notFound = false;
    
        } catch (error) {
          console.error('Error al buscar personajes:', error);
          personajes = [];
          notFound = true;
        }
      }
    </script>
    
    <form on:submit|preventDefault={buscarPersonajes}>
      <input bind:value={query} placeholder="Buscar personaje..." />
      <button type="submit">Buscar</button>
    </form>
    
    {#if personajes.length > 0}
      <ul style="list-style: none; padding: 0;">
        {#each personajes as p}
          <li style="margin-bottom: 1rem;">
            <img src={p.image} alt={p.name} width="100" style="border-radius: 8px;" />
            <div>
              <strong>{p.name}</strong><br />
              Estado: {p.status}<br />
              Especie: {p.species}
            </div>
          </li>
        {/each}
      </ul>
    {:else if notFound}
      <p>No se encontraron personajes con ese nombre.</p>
    {/if}
    