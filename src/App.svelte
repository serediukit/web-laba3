<script>
import { onMount } from 'svelte';
import http from './request-helper'
import OperationDocsStore from './operationDocsStore';
import {heroes} from './store'

onMount(async ()=>{
	const result = await http.startFetchMyQuery(OperationDocsStore.getAll());
	heroes.set(result.heroes)
})

const addHero = async () => {
	const name = prompt("name") || "";
	const desc = prompt("Description") || "";
	const photo = prompt("Photo URL") || "";
	const {insert_heroes_one} = await http.startExecuteMyMutation(OperationDocsStore.addOne(name,desc,photo));
	heroes.update(n=>[...n, insert_heroes_one])
}

const deleteHero = async () => {
	const name = prompt("which here to delete?")||""
	if(name){
		await http.startExecuteMyMutation(OperationDocsStore.deleteByName(name));
		heroes.update(n => n.filter(hero => hero.name!==name))
	}
}
</script>

<main>
	<button on:click={addHero}>Add new hero</button>
	<button on:click={deleteHero}>Delete hero</button>

	{#each $heroes as hero}
		<div>
			<p>Hero name: {hero.name}</p>
			<p>Description: {hero.description}</p>
			<p>Photo:</p> {#if hero.img}
			<img src="{hero.img}" alt="{hero.name}" width="400"/>
			{:else}
				<p>No photo.</p>
			{/if}
			<hr>
		</div>
	{/each}
</main>

<style>
</style>