<script>
    // @ts-nocheck
      let query = '';
      let peliculas = [];
      let notFound = false;
    
      async function buscarPeliculas() {
  try {
    const res = await fetch(`https://ghibli-api.vercel.app/api/films`);
    if (!res.ok) throw new Error('Error al obtener películas');

    const response = await res.json();
    const data = response.data; // Aquí accedemos al array real

    if (!Array.isArray(data)) {
      console.error('Respuesta inesperada:', response);
      peliculas = [];
      notFound = true;
      return;
    }

    // Filtro por título
    peliculas = data.filter(p =>
      p.title.toLowerCase().includes(query.trim().toLowerCase())
    );

    notFound = peliculas.length === 0;

  } catch (error) {
    console.error('Error al buscar películas:', error);
    peliculas = [];
    notFound = true;
  }
}
    </script>
    
    <form on:submit|preventDefault={buscarPeliculas}>
      <input bind:value={query} placeholder="Buscar película Ghibli..." />
      <button type="submit">Buscar</button>
    </form>
    
    {#if peliculas.length > 0}
      <ul style="list-style: none; padding: 0;">
        {#each peliculas as p}
          <li style="margin-bottom: 2rem;">
            <img src={p.image} alt={p.title} width="150" style="border-radius: 8px;" />
            <div>
              <h2>{p.title} ({p.release_date})</h2>
              <p><strong>Director:</strong> {p.director}</p>
              <p><strong>Puntuación:</strong> {p.rt_score}/100</p>
              <p>{p.description}</p>
            </div>
          </li>
        {/each}
      </ul>
    {:else if notFound}
      <p>No se encontraron películas con ese título.</p>
    {/if}
    