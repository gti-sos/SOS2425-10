<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
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

  interface Product {
    product_name: string;
    brands: string;
    image_url: string;
    nutriments: {
      "energy-kcal_100g"?: number;
      "fat_100g"?: number;
      "sugars_100g"?: number;
      "salt_100g"?: number;
    };
  }

  let chart: any;
  let product: Product | null = null;

  onMount(async () => {
    if (!browser) return;

    const REG_API = dev
      ? "http://localhost:16079/api/v1/registrations-stats"
      : "/api/v1/registrations-stats";

    const FOOD_API = "https://world.openfoodfacts.org/api/v0/product/737628064502.json";

    const [resReg, resFood] = await Promise.all([
      fetch(REG_API),
      fetch(FOOD_API)
    ]);

    const regData: Registration[] = await resReg.json();
    product = (await resFood.json()).product;

    const years = [...new Set(regData.map(r => r.year))].sort((a, b) => b - a);
    const latestYear = years[0];

    const filtered = regData.filter(r => r.year === latestYear);

    const categories = filtered.map(r => r.province);
    const data = filtered.map(r => r.total_general);

    chart = Highcharts.chart('container', {
      chart: {
        polar: true,
        type: 'column'
      },
      title: {
        text: `Matriculaciones por provincia en ${latestYear}`
      },
      xAxis: {
        categories,
        tickmarkPlacement: 'on',
        lineWidth: 0
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        min: 0,
        title: { text: 'Total matriculaciones' }
      },
      tooltip: {
        shared: true,
        pointFormat: '<b>{point.y} matriculaciones</b>'
      },
      series: [{
        name: 'Matriculaciones',
        data,
        pointPlacement: 'on'
      }],
      credits: { enabled: false }
    });
  });
</script>

{#if browser}
<div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; align-items: flex-start; margin-top: 1rem;">
  {#if product}
    <div style="max-width: 300px;">
      <h3>{product.product_name}</h3>
      <p><strong>Marca:</strong> {product.brands}</p>
      <img src={product.image_url} alt="Imagen del producto" style="width: 100%; border-radius: 8px;" />
    </div>
  {/if}

  <figure class="highcharts-figure" style="flex: 1;">
    <div id="container" style="min-width: 300px; height: 500px;"></div>
    <p class="highcharts-description">
      Comparativa de matriculaciones por provincia durante el año más reciente registrado.
      Datos combinados con un producto consultado en OpenFoodFacts.
    </p>
  </figure>
</div>
{/if}

<style>
  .highcharts-figure {
    max-width: 900px;
    margin: auto;
  }
  .highcharts-description {
    text-align: center;
    color: #555;
    margin-top: 1rem;
  }
</style>
