<script>
    //@ts-nocheck
    import {dev} from "$app/environment";
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/radars-stats";
    if (dev)
        API = DEVEL_HOST +API
    import {onMount} from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';
    let radars = [];
    let result = "";
    let resultStatus = "";
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

                </td>
            </tr>
        {/each}
    </tbody>

</Table>
<Button color="primary">Primary</Button>