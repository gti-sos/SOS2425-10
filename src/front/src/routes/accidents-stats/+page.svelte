
<h2> Accidents Stats Table</h2>


<script>
// @ts-nocheck

    
    let API = "http://localhost:16079/api/v1/accidents-stats";
    import { onMount } from "svelte";
    let VCH= []
    let result= "";
    let resultStatus="";

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

    onMount(async () =>{
        getAccidentsStats();
    })
</script>

<table>
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

        </tr>
        {/each}
    </tbody>
</table>

