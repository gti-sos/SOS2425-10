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

	interface DataPoint {
		year: number;
		province: string;
		total_general?: number;
		complaint?: number;
		total_victims?: number;
	}

	let chart: any;

	let API_REG = "/api/v1/registrations-stats";
	let API_RAD = "/api/v1/radars-stats";
	let API_ACC = "/api/v2/accidents-stats";

	if (dev) {
		API_REG = "http://localhost:16079" + API_REG;
		API_RAD = "http://localhost:16079" + API_RAD;
		API_ACC = "http://localhost:16079" + API_ACC;
	}

	async function fetchAndUpdateChart() {
		const [regRes, radRes, accRes] = await Promise.all([
			fetch(API_REG),
			fetch(API_RAD),
			fetch(API_ACC)
		]);

		const regData: DataPoint[] = await regRes.json();
		const radData: DataPoint[] = await radRes.json();
		const accData: DataPoint[] = await accRes.json();

		const years: number[] = [...new Set(
			[...regData, ...radData, ...accData].map(d => d.year)
		)].filter(Boolean).sort();

		const registrations = years.map(year =>
			regData.filter(d => d.year === year)
				.reduce((acc, d) => acc + (d.total_general || 0), 0)
		);

		const fines = years.map(year =>
			radData.filter(d => d.year === year)
				.reduce((acc, d) => acc + (d.complaint || 0), 0)
		);

		const victims = years.map(year =>
			accData.filter(d => d.year === year)
				.reduce((acc, d) => acc + (d.total_victims || 0), 0)
		);

		if (!chart) {
			chart = Highcharts.chart('container', {
				chart: { type: 'column' },
				title: { text: 'Estadísticas combinadas por año' },
				xAxis: {
					categories: years.map(String),
					title: { text: 'Año' },
					gridLineWidth: 1,
					lineWidth: 0
				},
				yAxis: {
					min: 0,
					title: { text: 'Cantidad total', align: 'high' },
					labels: { overflow: 'justify' },
					gridLineWidth: 0
				},
				tooltip: { shared: true },
				plotOptions: {
					column: {
						borderRadius: 4,
						groupPadding: 0.1,
						dataLabels: { enabled: true }
					}
				},
				legend: {
					layout: 'horizontal',
					align: 'center',
					verticalAlign: 'bottom',
					backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
					shadow: false
				},
				credits: { enabled: false },
				series: [
					{ name: 'Matriculaciones', data: registrations },
					{ name: 'Multas por radar', data: fines },
					{ name: 'Víctimas por accidente', data: victims }
				]
			});
		} else {
			chart.xAxis[0].setCategories(years.map(String));
			chart.series[0].setData(registrations);
			chart.series[1].setData(fines);
			chart.series[2].setData(victims);
		}
	}

	onMount(() => {
		fetchAndUpdateChart();
		const interval = setInterval(fetchAndUpdateChart, 4000);
		return () => clearInterval(interval);
	});
</script>

<figure class="highcharts-figure">
	<div id="container" style="width: 100%; height: 500px;"></div>
	<p class="highcharts-description">
		Gráfico de columnas agrupadas que muestra la evolución anual del número de matriculaciones, multas por radar y víctimas por accidente.
		Se actualiza automáticamente cada pocos segundos si los datos cambian desde el frontend.
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
