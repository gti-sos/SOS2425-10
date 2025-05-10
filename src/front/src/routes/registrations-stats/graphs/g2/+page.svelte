<svelte:head>
	<script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	const API = dev
		? 'http://localhost:16079/api/v1/registrations-stats'
		: '/api/v1/registrations-stats';

	onMount(async () => {
		const res = await fetch(API);
		const data = await res.json();

		// Agrupar totales por provincia
		const provinceTotals: Record<string, number> = {};

		for (const d of data) {
			const key = d.province;
			const value = d.total_general || 0;
			provinceTotals[key] = (provinceTotals[key] || 0) + value;
		}

		const pieData = Object.entries(provinceTotals).map(([province, total]) => ({
			text: province,
			values: [total]
		}));

		// @ts-ignore
		const zingchart = (window as any).zingchart;

		zingchart.render({
			id: 'chartDiv',
			data: {
				type: 'pie',
				title: {
					text: 'Matriculaciones Totales por Provincia'
				},
				plot: {
					borderColor: '#2B313B',
					borderWidth: 5,
					valueBox: {
						placement: 'out',
						text: '%t\n%npv%',
						fontFamily: 'Open Sans'
					},
					tooltip: {
						fontSize: 16,
						anchor: 'c',
						x: '50%',
						y: '50%',
						sticky: true,
						tooltipText: '%t\n%v',
						backgroundColor: 'white',
						borderColor: '#e3e3e3',
						textColor: 'black'
					},
					animation: {
						effect: 2,
						method: 5,
						speed: 800,
						sequence: 1
					}
				},
				series: pieData
			},
			height: 500,
			width: '100%'
		});
	});
</script>

<div id="chartDiv"></div>

<style>
	#chartDiv {
		width: 100%;
		height: 500px;
		margin: 2rem auto;
	}
</style>