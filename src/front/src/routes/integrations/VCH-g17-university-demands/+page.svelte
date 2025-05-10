<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  // @ts-ignore
  const Highcharts = window.Highcharts;

  let localAPI = "/api/v2/accidents-stats";
  if (dev) localAPI = "http://localhost:16079" + localAPI;

  const remoteAPI = "https://sos2425-17.onrender.com/api/v2/university-demands";

  function normalizeProvince(name) {
    return name
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();
  }

  async function fetchUniversityData() {
    let res = await fetch(remoteAPI);
    let data = [];
    if (res.ok) {
      data = await res.json();
      if (!data.length) {
        await fetch(remoteAPI + "/loadInitialData");
        res = await fetch(remoteAPI);
        data = await res.json();
      }
    } else {
      console.error("Error fetching university-demands");
    }
    return data;
  }

  async function fetchAccidentData() {
    const res = await fetch(localAPI);
    if (res.ok) {
      return await res.json();
    } else {
      console.error("Error fetching accidents-stats");
      return [];
    }
  }

  onMount(async () => {
    const [accidents, universityDemands] = await Promise.all([
      fetchAccidentData(),
      fetchUniversityData()
    ]);

    const accidentSeries = {};
    accidents.forEach(item => {
      const province = normalizeProvince(item.province);
      accidentSeries[province] = (accidentSeries[province] || 0) + (item.total_victims || 0);
    });

    const universitySeries = {};
    universityDemands.forEach(item => {
      const province = normalizeProvince(item.location); // ✅ Usamos el campo correcto
      if (province) {
        universitySeries[province] = (universitySeries[province] || 0) + (item.graduated || 0);
      }
    });

    const allProvinces = Array.from(
      new Set([...Object.keys(accidentSeries), ...Object.keys(universitySeries)])
    ).sort();

    const accidentData = allProvinces.map(p => accidentSeries[p] || 0);
    const universityData = allProvinces.map(p => universitySeries[p] || 0);

    Highcharts.chart('container', {
      chart: {
        type: 'area'
      },
      accessibility: {
        description: 'University demands + Accidents stats grouped by province'
      },
      title: {
        text: 'Graduated Students vs Accident Victims by Province'
      },
      subtitle: {
        text: 'NÓTESE LOS VALORES DE ACCIDENTES QUE SON MUCHO MENORES'
      },
      xAxis: {
        categories: allProvinces.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
        allowDecimals: false,
        accessibility: {
          rangeDescription: 'Provinces involved.'
        }
      },
      yAxis: {
        title: {
          text: 'People'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y:,.0f}</b><br/>'
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: [
        {
          name: 'Graduated Students',
          data: universityData
        },
        {
          name: 'Accident Victims',
          data: accidentData
        }
      ]
    });
  });
</script>

<figure class="highcharts-figure">
  <div id="container"></div>
  <p class="highcharts-description">
    Comparativa en gráfico de área entre estudiantes graduados y víctimas totales de accidentes, agrupadas por provincia.
  </p>
</figure>

<style>
.highcharts-figure,
.highcharts-data-table table {
  min-width: 320px;
  max-width: 800px;
  margin: 1em auto;
}

#container {
  height: 450px;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}

.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tbody tr:nth-child(even) {
  background: #f8f8f8;
}

.highcharts-data-table tr:hover {
  background: #f1f7ff;
}

.highcharts-description {
  margin: 0.3rem 10px;
}
</style>
