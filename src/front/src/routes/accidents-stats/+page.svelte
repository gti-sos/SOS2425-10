<h2> Accidents Stats Table</h2>


<script>
// @ts-nocheck
    import { dev } from "$app/environment";
    let PROD_HOST = "";
    let DEVEL_HOST = "http://localhost:16079";
    let API = "/api/v1/accidents-stats";

    if (dev)
        API= DEVEL_HOST + API;
    import { onMount } from "svelte";
    import { Button, Table } from '@sveltestrap/sveltestrap';

    let VCH= []
    let result= "";
    let resultStatus="";
    let newAccidentId="";
    let newYear="";
    let newMonth="";
    let newProvince="";
    let newMunicipality_code="";
    let newRoad="";
    let newKm="";
    let newDirection_1f="";
    let newAccidentType="";
    let newTotal_victims="";

    async function getAccidentsStats(){
        resultStatus= result="";
        try{
            const res = await fetch(API,{method:"GET"});
        
            const data = await res.json();
            result= JSON.stringify(data,null,2)
            
            
            VCH=data;
            console.log(`Reponse received:\n ${JSON.stringify(VCH, null,2)}`)


        }catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
    }
    async function deleteAccident(accident_id){
        resultStatus = result = "";
        try {
            const res = await fetch(API+"/"+accident_id,{method:"DELETE"});
  
            const status = await res.status;
            resultStatus = status;

            if(status == 200){
                console.log(`Accident ${accident_id} deleted`);
                getAccidentsStats();
            } else {
                console.log(`ERROR deleting accident ${accident_id}: status received\n${status}`);
            }


        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }
    
    async function createAccident(){
        resultStatus= result="";
        try{
            const res = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    accident_id:newAccidentId,
                    year:newYear,
                    month:newMonth,
                    province:newProvince,
                    municipality_code:newMunicipality_code,
                    road:newRoad,
                    km:newKm,
                    direction_1f:newDirection_1f,
                    accident_type:newAccidentType,
                    total_victims:newTotal_victims
                
                })
            
            });
        
            const status = await res.status;
            resultStatus= status;
            if (status == 201){
                console.log(`Accident created`);
                getAccidentsStats();
            }
            else{
                console.log(`Error creating accident:\n ${status}`);
            }


        }catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
    }

    

    onMount(async () =>{
        getAccidentsStats();
    })

    
</script>

<Table>
    <thead>
        <tr>
            <th>accident_id</th>
            <th>year</th>
            <th>month</th>
            <th>province</th>
            <th>municipality_code</th>
            <th>road</th>
            <th>km</th>
            <th>direction_1f</th>
            <th>accident_type</th>
            <th>total_victims</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>
                <input bind:value={newAccidentId}> 
            </td>
            <td>
                <input bind:value={newYear}> 
            </td>
            <td>
                <input bind:value={newMonth}> 
            </td>
            <td>
                <input bind:value={newProvince}> 
            </td>
            <td>
                <input bind:value={newMunicipality_code}> 
            </td>
            
            <td>
                <input bind:value={newRoad}> 
            </td>
            <td>
                <input bind:value={newKm}> 
            </td>
            <td>
                <input bind:value={newDirection_1f}> 
            </td>
            <td>
                <input bind:value={newAccidentType}> 
            </td>
            <td>
                <input bind:value={newTotal_victims}> 
            </td>
            <td>
                <Button color="secondary" on:click={createAccident}>Create Accident </Button>  
            </td>
        </tr>
        {#each VCH as dato}


        <tr>
            <td>
                {dato.accident_id}
            </td>
            <td>
                {dato.year}
            </td>
            <td>
                {dato.month}
            </td>
            <td>
                {dato.province}
            </td>
            <td>
                {dato.municipality_code}
            </td>
            <td>
                {dato.road}
            </td>
            <td>
                {dato.km}
            </td>
            <td>
                {dato.direction_1f}
            </td>
            <td>
                {dato.accident_type}
            </td>
            <td>
                {dato.total_victims}
            </td>
            <td>
                <Button color="danger" on:click={() => {deleteAccident(dato.accident_id)}}>Delete</Button>
            </td>

        </tr>
        {/each}
    </tbody>
</Table>

