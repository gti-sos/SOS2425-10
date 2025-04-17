<h2> Registrations Stats Table</h2>


<script>
// @ts-nocheck
    import { dev } from "$app/environment";
    
    let PROD_HOST = "";
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/registrations-stats";
    if (dev)
        API= DEVEL_HOST + API;
    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';
    let JAM= []
    let result= "";
    let resultStatus="";

    async function getRegistrationsStats(){
        resultStatus= result="";
        try{
            const res = await fetch(API,{method:"GET"});
        
            const data = await res.json();
            result= JSON.stringify(data,null,2)
            
            
            JAM=data;
            console.log(`Reponse received:\n ${JSON.stringify(JAM, null,2)}`)


        }catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
    }

    onMount(async () =>{
        getRegistrationsStats();
    })

    
</script>

<Table>
    <thead>
        <tr>
            <th>year</th>
            <th>province</th>
            <th>total_general_national</th>
            <th>total_general_import</th>
            <th>total_general_auction</th>
            <th>total_general</th>
        </tr>
    </thead>

    <tbody>
        {#each JAM as dato}
        <tr>
            <td>
                {dato.year}
            </td>
            <td>
                {dato.province}
            </td>
            <td>
                {dato.total_general_national}
            </td>
            <td>
                {dato.total_general_import}
            </td>
            <td>
                {dato.total_general_auction}
            </td>
            <td>
                {dato.total_general}
            </td>
            

        </tr>
        {/each}
    </tbody>
</Table>



<Button color="danger">PULSAME </Button>