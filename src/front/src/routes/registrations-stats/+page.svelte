<svelte:head>
    <title>
        REGISTRATIONS STATS
    </title>
</svelte:head>

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
    let newYear="";
    let newProvince="";
    let newTotal_general_national="";
    let newTotal_general_import="";
    let newTotal_general_auction="";
    let newTotal_general="";
    let from = '';
    let to = '';
    let filterYear = '';
    let filterProvince = '';
    let filterNational = '';
    

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
    async function deleteRegistration(total_general_national){
        resultStatus = result = "";
        getRegistrationsStats();
        try {
            
            const res = await fetch(API+"/"+total_general_national,{method:"DELETE"});
  
            const status = await res.status;
            resultStatus = status;

            if(status == 200){
                console.log(`Registration ${total_general_national} deleted`);
                getRegistrationsStats();
            } else {
                console.log(`ERROR deleting registration ${total_general_national}: status received\n${status}`);
            }


        } catch (error){
            console.log(`ERROR:  GET from ${API}: ${error}`);
        }


    }
    
    async function createRegistration(){
        resultStatus= result="";
        try{
            const res = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    year:newYear,
                    province:newProvince,
                    total_general_national:newTotal_general_national,
                    total_general_import:newTotal_general_import,
                    total_general_auction:newTotal_general_auction,
                    total_general:newTotal_general,
                
                })
            
            });
        
            const status = await res.status;
            resultStatus= status;
            if (status == 201){
                console.log(`Registration created`);
                getRegistrationsStats();
            }
            else{
                console.log(`Error creating registration:\n ${status}`);
            }


        }catch(error){
            console.log(`ERROR getting data from ${API}: ${error}`);
        }
    }

    async function deleteAllRegistrations() {
        const res = await fetch(API, { method: "DELETE" });
        if (res.status === 200) {
            await getRegistrationsStats();
        }
    }   

    async function loadInitialData() {
        const res = await fetch(`${API}/loadInitialData`);
        const status = res.status;

        if (status === 201 || status === 200) {
            console.log("Datos cargados correctamente");
            await getRegistrationsStats();
        } else if (status === 400) {
            console.log("Los datos ya estaban cargados");
        } else {
            const errorText = await res.text();
            console.error("Error:", status, errorText);
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
        <tr>
            <td>
                <input bind:value={newYear}>  
            </td>
            <td>
                <input bind:value={newProvince}>
            </td>
            <td>
                <input bind:value={newTotal_general_national}> 
            </td>
            
            <td>
                <input bind:value={newTotal_general_import}> 
            </td>
            <td>
                <input bind:value={newTotal_general_auction}> 
            </td>
            <td>
                <input bind:value={newTotal_general}> 
            </td>
            
            <td>
                <Button color="secondary" on:click={createRegistration}>Create Registration </Button>  
            </td>
        </tr>
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
            <td>
                <Button color="danger" on:click={() => {deleteRegistration(dato.total_general_national)}}>Delete</Button>
            </td>
            

        </tr>
        {/each}
        <tr><td>
            <Button color="danger" on:click={() => {deleteAllRegistrations()}}>Borrar todos</Button>
            <Button color="secondary" on:click={() => {loadInitialData()}}>Cargar datos iniciales</Button>
        </td></tr>
    </tbody>
</Table>

