<script>
  import { onMount } from "svelte";
  import http from "./request-helper";
  import OperationDocsStore from "./operationDocsStore";
  import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
  import { setClient, subscribe } from "svelte-apollo";
  import { WebSocketLink } from "@apollo/client/link/ws";
  import { getMainDefinition } from "@apollo/client/utilities";

  function createApolloClient() {
    const httpLink = new HttpLink({
      uri: "https://web-labaa-3.herokuapp.com/v1/graphql",
    });
    const cache = new InMemoryCache();
    const wsLink = new WebSocketLink({
      uri: "wss://web-labaa-3.herokuapp.com/v1/graphql",
      options: {
        reconnect: true,
      },
    });
    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink,
    );
    return new ApolloClient({
      link,
      cache,
    });
  }

  const client = createApolloClient();
  setClient(client);
  const heroes = subscribe(OperationDocsStore.subscribeToAll());

  const addHero = async () => {
    const name = prompt("name") || "";
    const desc = prompt("Description") || "";
    const photo = prompt("Photo URL") || "";
    await http.startExecuteMyMutation(
      OperationDocsStore.addOne(name, desc, photo),
    );
    // heroes.update(n=>[...n, insert_heroes_one])
  };

  const deleteHero = async () => {
    const name = prompt("which here to delete?") || "";
    if (name) {
      await http.startExecuteMyMutation(OperationDocsStore.deleteByName(name));
      // heroes.update(n => n.filter(hero => hero.name!==name))
    }
  };
</script>

<main>
  {#if $heroes.loading}
    <h1>Loading...</h1>
  {:else if $heroes.error}
    <h1>{$heroes.error}</h1>
  {:else}
    <button on:click={addHero}>Add new hero</button>
    <button on:click={deleteHero}>Delete hero</button>

    {#each $heroes.data.heroes as hero}
      <div>
        <p>Hero name: {hero.name}</p>
        <p>Description: {hero.description}</p>
        <p>Photo:</p>
        {#if hero.img}
          <img src={hero.img} alt={hero.name} width="400" />
        {:else}
          <p>No photo.</p>
        {/if}
        <hr />
      </div>
    {/each}
  {/if}
</main>

<style>
  main {
    margin: 0;
    padding: 0;
  }
</style>
