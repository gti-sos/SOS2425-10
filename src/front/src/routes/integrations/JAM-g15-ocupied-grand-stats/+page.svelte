<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/packed-bubble.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { dev, browser } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  interface Registration {
    year: number;
    province: string;
    total_general: number;
  }

  interface LandStat {
    year: number;
    province: string;
    ground: number;
    grass: number;
    wooded: number;
    non_agrarian_surface: number;
  }

  let chart: any;
  let years: number[] = [];
  let selectedYear: number;

  const registrationByYear = new Map<number, number>();
  const surfaceByYear = new Map<number, number>();

  if (browser) {
    onMount(async () => {
      const API_LOCAL = dev
        ? "http://localhost:16079/api/v1/registrations-stats"
        : "/api/v1/registrations-stats";

      const API_EXTERNAL = dev
        ? "http://localhost:16079/api-proxy/api/v1/ocupied-grand-stats"
        : "/api-proxy/api/v1/ocupied-grand-stats";

      const [resLocal, resExternal] = await Promise.all([
        fetch(API_LOCAL),
        fetch(API_EXTERNAL)
      ]);

      const localData: Registration[] = await resLocal.json();
      const externalData: LandStat[] = await resExternal.json();

      years = [...new Set([
        ...localData.map(d => Number(d.year)),
        ...externalData.map(d => Number(d.year))
      ])].sort((a, b) => a - b);

      years.forEach(year => {
        const regTotal = localData
          .filter(d => Number(d.year) === year)
          .reduce((sum, d) => sum + (Number(d.total_general) || 0), 0);
        registrationByYear.set(year, regTotal);

        const surfaceTotal = externalData
          .filter(d => Number(d.year) === year)
          .reduce((sum, d) =>
            sum +
            (Number(d.ground) || 0) +
            (Number(d.grass) || 0) +
            (Number(d.wooded) || 0) +
            (Number(d.non_agrarian_surface) || 0),
            0
          );
        surfaceByYear.set(year, surfaceTotal);
      });

      selectedYear = years[years.length - 1];
      renderChart();
    });
  }

  function renderChart() {
    const registrations = registrationByYear.get(selectedYear) || 0;
    const surface = surfaceByYear.get(selectedYear) || 0;

    chart = Highcharts.chart('container', {
      chart: {
        type: 'packedbubble'
      },
      title: {
        text: `Packed Bubble: Matriculaciones vs Superficie Ocupada en ${selectedYear}`
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value} unidades'
      },
      plotOptions: {
        packedbubble: {
          minSize: '30%',
          maxSize: '120%',
          zMin: 0,
          zMax: Math.max(registrations, surface),
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: false,
            seriesInteraction: false,
            dragBetweenSeries: false,
            parentNodeLimit: true
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 1000
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        }
      },
      series: [{
        name: `Estadísticas ${selectedYear}`,
        data: [
          { name: 'Matriculaciones', value: registrations },
          { name: 'Superficie Ocupada', value: surface }
        ]
      }],
      credits: { enabled: false }
    });
  }
</script>

{#if browser}
<figure class="highcharts-figure">
  <label for="year-select" style="display: block; text-align: center; margin-bottom: 10px;">
    Selecciona año:
    <select id="year-select" bind:value={selectedYear} on:change={renderChart}>
      {#each years as y}
        <option value={y}>{y}</option>
      {/each}
    </select>
  </label>
  <div id="container" style="width: 100%; height: 600px;"></div>
  <p class="highcharts-description">
    Visualización de burbujas que compara el volumen total de matriculaciones (API propia) con la superficie ocupada del suelo (grupo 15) para el año seleccionado.
  </p>
</figure>
{/if}

<style>
  .highcharts-figure {
    max-width: 1000px;
    margin: auto;
  }

  .highcharts-description {
    text-align: center;
    margin-top: 1rem;
    color: #555;
  }

  select {
    padding: 0.4em 0.8em;
    font-size: 1rem;
    margin-left: 0.5em;
  }
</style>
