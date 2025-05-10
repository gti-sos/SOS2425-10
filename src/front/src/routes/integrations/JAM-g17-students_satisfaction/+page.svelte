<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/heatmap.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
</svelte:head>

<script lang="ts">
  /// <reference types="highcharts" />
  import { onMount } from 'svelte';
  import { dev, browser } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  interface Registration {
    year: number;
    province: string;
    total_general: number;
  }

  interface Satisfaction {
    año_academico: string;
    satisfaccion_total: number;
    satisfaccion_pdi: number;
    sat_estudiantes: number;
  }

  let chart: any;
  let years: number[] = [];

  if (browser) {
    onMount(async () => {
      const API_LOCAL = dev
        ? "http://localhost:16079/api/v1/registrations-stats"
        : "/api/v1/registrations-stats";

      const API_EXTERNAL = dev
        ? "http://localhost:16079/api-proxy/api/v2/students_satisfaction"
        : "/api-proxy/api/v2/students_satisfaction";

      // 🔄 Forzar carga inicial si los datos están vacíos
      await fetch(`${API_EXTERNAL}/loadInitialData`);

      const [resLocal, resExternal] = await Promise.all([
        fetch(API_LOCAL),
        fetch(API_EXTERNAL)
      ]);

      const localData: Registration[] = await resLocal.json();
      const externalDataRaw = await resExternal.json();

      // 🛡 Validación
      if (!Array.isArray(externalDataRaw)) {
        console.error("⚠️ La API de satisfacción devolvió un valor no iterable:", externalDataRaw);
        return;
      }
      const externalData: Satisfaction[] = externalDataRaw;

      // 📅 Años únicos combinados
      const parsedYears = [
        ...new Set([
          ...localData.map(d => Number(d.year)),
          ...externalData.map(e => Number(e.año_academico.slice(0, 4)))
        ])
      ].sort((a, b) => a - b);

      years = parsedYears;

      const categories = [
        'Matriculaciones',
        'Satisfacción total',
        'Satisfacción PDI',
        'Satisfacción estudiantes'
      ];

      const seriesData: [number, number, number][] = [];

      parsedYears.forEach((year, xIndex) => {
        const reg = localData
          .filter(d => Number(d.year) === year)
          .reduce((sum, d) => sum + (Number(d.total_general) || 0), 0);

        const externalByYear = externalData
          .filter(e => Number(e.año_academico.slice(0, 4)) === year);

        const sat_total = externalByYear
          .reduce((sum, e) => sum + (e.satisfaccion_total || 0), 0);
        const sat_pdi = externalByYear
          .reduce((sum, e) => sum + (e.satisfaccion_pdi || 0), 0);
        const sat_est = externalByYear
          .reduce((sum, e) => sum + (e.sat_estudiantes || 0), 0);

        seriesData.push([xIndex, 0, reg]);
        seriesData.push([xIndex, 1, sat_total]);
        seriesData.push([xIndex, 2, sat_pdi]);
        seriesData.push([xIndex, 3, sat_est]);
      });

      chart = Highcharts.chart('container', {
        chart: { type: 'heatmap', marginTop: 40 },
        title: { text: 'Matriz de calor: Matriculaciones y niveles de satisfacción' },
        xAxis: {
          categories: parsedYears.map(String),
          title: { text: 'Año' }
        },
        yAxis: {
          categories,
          title: null
        },
        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0]
        },
        legend: {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280
        },
        tooltip: {
          formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
            const x = this.series.xAxis?.categories?.[this.point.x as number] || this.x;
            const y = this.series.yAxis?.categories?.[this.point.y as number] || this.y;
            return `<b>${y}</b><br>Año: ${x}<br>Valor: ${this.point.value}`;
          }
        },
        series: [{
          name: 'Valores',
          borderWidth: 1,
          data: seriesData,
          dataLabels: {
            enabled: true,
            color: '#000000'
          }
        }],
        credits: { enabled: false }
      });
    });
  }
</script>

{#if browser}
<figure class="highcharts-figure">
  <div id="container" style="height: 500px; width: 100%"></div>
  <p class="highcharts-description">
    Mapa de calor que compara matriculaciones (API propia) con los niveles de satisfacción total, del profesorado y del estudiantado (grupo 17), agrupados por año académico.
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
    color: #444;
  }
</style>
