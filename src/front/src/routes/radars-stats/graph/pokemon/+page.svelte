<script>
  // @ts-nocheck
    let query = '';
    let pokemon = null;
    let notFound = false;
  
    async function buscarPokemon() {
      try {
        const name = query.trim().toLowerCase();
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  
        if (!res.ok) {
          notFound = true;
          pokemon = null;
          return;
        }
  
        const data = await res.json();
        pokemon = data;
        notFound = false;
  
      } catch (error) {
        console.error('Error al buscar el Pokémon:', error);
        pokemon = null;
        notFound = true;
      }
    }
  </script>
  
  <form on:submit|preventDefault={buscarPokemon}>
    <input bind:value={query} placeholder="Buscar Pokémon por nombre..." />
    <button type="submit">Buscar</button>
  </form>
  
  {#if pokemon}
    <div>
      <h2>{pokemon.name.toUpperCase()}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} width="100" />
      <p>Altura: {pokemon.height / 10} m</p>
      <p>Peso: {pokemon.weight / 10} kg</p>
      <p>Tipo(s): {pokemon.types.map(t => t.type.name).join(', ')}</p>
    </div>
  {:else if notFound}
    <p>No se encontró el Pokémon "{query}"</p>
  {/if}
  