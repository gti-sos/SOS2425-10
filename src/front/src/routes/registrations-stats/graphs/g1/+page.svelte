<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

    // @ts-ignore
    const Highcharts = window.Highcharts;



	interface RegistrationData {
		year: number;
		province: string;
		total_general_national: number;
		total_general_import: number;
		total_general_auction: number;
		total_general: number;
	}

	let chart: any;

	let API = "/api/v1/registrations-stats";
	if (dev) API = "http://localhost:16079" + API;

	async function fetchAndUpdateChart() {
		const res = await fetch(API);
		const data: RegistrationData[] = await res.json();

		const years: number[] = [...new Set(data.map((d) => d.year))].sort();

		const national = years.map((year) =>
			data.filter((d) => d.year === year)
				.reduce((acc, d) => acc + (d.total_general_national || 0), 0)
		);

		const imported = years.map((year) =>
			data.filter((d) => d.year === year)
				.reduce((acc, d) => acc + (d.total_general_import || 0), 0)
		);

		const auction = years.map((year) =>
			data.filter((d) => d.year === year)
				.reduce((acc, d) => acc + (d.total_general_auction || 0), 0)
		);

		if (!chart) {
			chart = Highcharts.chart('container', {
				chart: { type: 'bar' },
				title: { text: 'Matriculaciones Totales por Año' },
				xAxis: {
					categories: years.map(String),
					title: { text: null },
					gridLineWidth: 1,
					lineWidth: 0
				},
				yAxis: {
					min: 0,
					title: { text: 'Número de Matriculaciones', align: 'high' },
					labels: { overflow: 'justify' },
					gridLineWidth: 0
				},
				tooltip: { valueSuffix: ' matriculaciones' },
				plotOptions: {
					bar: {
						borderRadius: '50%',
						dataLabels: { enabled: true },
						groupPadding: 0.1
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -40,
					y: 80,
					floating: true,
					borderWidth: 1,
					backgroundColor:
						Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
					shadow: true
				},
				credits: { enabled: false },
				series: [
					{ name: 'Nacionales', data: national },
					{ name: 'Importados', data: imported },
					{ name: 'Subastas', data: auction }
				]
			});
		} else {
			chart.xAxis[0].setCategories(years.map(String));
			chart.series[0].setData(national);
			chart.series[1].setData(imported);
			chart.series[2].setData(auction);
		}
	}

	onMount(() => {
		fetchAndUpdateChart();
		const interval = setInterval(fetchAndUpdateChart, 2000);
		return () => clearInterval(interval);
	});
</script>
<figure class="highcharts-figure">
	<div id="container" style="width: 100%; height: 500px;"></div>
	<p class="highcharts-description">
		Gráfico de barras que representa el número total de matriculaciones nacionales, importadas y por subasta por año.
		Se actualiza automáticamente si los datos cambian desde el frontend.
	</p>
</figure>

<style>
	.highcharts-figure {
		min-width: 310px;
		max-width: 800px;
		margin: 1em auto;
	}
	.highcharts-description {
		margin: 1rem;
		text-align: center;
		color: #555;
	}
</style>
