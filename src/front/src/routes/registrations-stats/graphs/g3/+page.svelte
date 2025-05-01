<svelte:head>
	<script src="https://unpkg.com/vis-graph3d@latest/dist/vis-graph3d.min.js"></script>
</svelte:head>

<script context="module" lang="ts">
	declare const vis: any;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = "/api/v1/registrations-stats";
	if (dev) API = "http://localhost:16079" + API;

	onMount(async () => {
		const res = await fetch(API);
		const data = await res.json();

		const provinceMap: Record<string, number> = {};
		let nextIndex = 1;

		const points = data.map((d: any) => {
			if (!(d.province in provinceMap)) {
				provinceMap[d.province] = nextIndex++;
			}
			return {
				x: provinceMap[d.province],
				y: d.year,
				z: d.total_general_national || 0,
				style: d.total_general_national || 0
			};
		});

		const dataset = new vis.DataSet(points);

		const options = {
			width: '100%',
			height: '500px',
			style: 'bar-color',
			showPerspective: true,
			showGrid: true,
			showShadow: true,
			keepAspectRatio: true,
			verticalRatio: 0.5
		};

		const container = document.getElementById('graph');
		new vis.Graph3d(container, dataset, options);
	});
</script>

<h2 style="text-align: center;">Gráfico 3D de Matriculaciones Nacionales</h2>
<div id="graph" style="margin: auto;"></div>
