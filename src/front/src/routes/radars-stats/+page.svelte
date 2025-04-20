<svelte:head>
    <title>Radars-stats</title>
</svelte:head>

<script>
    //@ts-nocheck
    import {dev} from "$app/environment";
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/radars-stats";
    if (dev)
        API = DEVEL_HOST +API
    import {onMount} from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';
	import { title } from "process";
    let radars = [];
    let result = "";
    let resultStatus = "";
    let newRadarCommunity;
    let newRadarProvince;
    let newRadarWay;
    let newRadarKilometerPoint;
    let newRadarComplaint;
    let newRadarYear;
    let newRadarSpeedEstimation;
    let newRadarAverageSpeedFined;
    async function  getRadars(){
        resultStatus = result = "";
        

        try {
            const res = await fetch(API,{method:"GET"});
            const data =  await res.json();
            result = JSON.stringify(data,null,2);
            
            
            radars = data;
            console.log(`Response received:\n ${JSON.stringify(radars,null,2)}`);
            
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }

    async function  deleteRadar(way,kilometerPoint){
        resultStatus = result = "";
        

        try {
            const res = await fetch(`${API}/${encodeURIComponent(way)}/${encodeURIComponent(kilometerPoint)}`, { method: "DELETE" });

            
            const status =  await res.status;
            resultStatus =status
            
            if (status== 200){
                console.log(`Radar ${way,kilometerPoint} deleted `);
                getRadars();
            }else{
                console.log(`ERROR deleting radar ${way,kilometerPoint}:\n ${status}`);
            }
            
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
    async function  createRadar(){
        resultStatus = result = "";
        

        try {
            const res = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    autonomousCommunity: newRadarCommunity,
                    province: newRadarProvince,
                    way: newRadarWay,
                    kilometerPoint: parseFloat(newRadarKilometerPoint),
                    complaint: newRadarComplaint,
                    year: newRadarYear,
                    speedEstimation: newRadarSpeedEstimation,
                    averageSpeedFined: newRadarAverageSpeedFined
                })
            });
            const status =  await res.status;
            resultStatus =status
            
            if (status== 201){
                console.log(`Radar created `);
                getRadars();
            }else{
                console.log(`ERROR creating radar received:\n ${status}`);
            }
            
            
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
    onMount(async () => {
        getRadars();
    })
</script>

<h2>Radars List</h2>


<Table>
    <thead>
        <tr>
            <th>autonomousCommunity</th>
            <th>province</th>
            <th>way</th>
            <th>kilometerPoint</th>
            <th>complaint</th>
            <th>year</th>
            <th>speedEstimation</th>
            <th>averageSpeedFined</th>
            <th>Actions</th>
        </tr>
        

    </thead>

    <tbody>
        <tr>
            <td>
                <input bind:value={newRadarCommunity}>
            </td>
            <td>
                <input bind:value={newRadarProvince}>
            </td>
            <td>
                <input bind:value={newRadarWay}>
            </td>
            <td>
                <input bind:value={newRadarKilometerPoint}>
            </td>
            <td>
                <input bind:value={newRadarComplaint}>
            </td>
            <td>
                <input bind:value={newRadarYear}>
            </td>
            <td>
                <input bind:value={newRadarSpeedEstimation}>
            </td>
            <td>
                <input bind:value={newRadarAverageSpeedFined}>
            </td>
            <td>
                <Button color="primary" on:click={createRadar}>Create</Button>
            </td>
        </tr>
        {#each radars as radar}
            <tr>
                <td>
                    {radar.autonomousCommunity}
                </td>
                <td>
                    {radar.province}
                </td>
                <td>
                    {radar.way}
                </td>
                <td>
                    {radar.kilometerPoint}
                </td>
                <td>
                    {radar.complaint}
                </td>
                <td>
                    {radar.year}
                </td>
                <td>
                    {radar.speedEstimation}
                </td>
                <td>
                    {radar.averageSpeedFined}
                </td>
                <td>
                    <Button color="danger" on:click={() => deleteRadar(radar.way,radar.kilometerPoint)}>Delete</Button>
                </td>
            </tr>
        {/each}
    </tbody>

</Table>
