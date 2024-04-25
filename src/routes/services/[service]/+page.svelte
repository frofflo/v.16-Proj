<script lang="ts">
  import { enhance } from '$app/forms';
  import { onDestroy } from 'svelte';
  import type { PageData } from './$types';
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  
  export let data: PageData;
  export let form;
  $: username = data.username;
  $: service = data?.service;

  $: liked = isLiked(service, username);

  if (browser) {
      let interval: NodeJS.Timeout;

      interval = setInterval(invalidateAll, 1000) ; null;

      onDestroy(() => {
          clearInterval(interval);
          invalidateAll();
      });
  }   
  
  function isLiked(service: any, username: string|undefined): boolean {
      if (!username) return false;
      if (!service.isLikedBy) return false;
      for (let i = 0; i < service.isLikedBy.length; i++) {
          if (service.isLikedBy[i].name == username) {
              return true;
          }
      }
      return false
  }
</script>

<nav class="ml-4">
    <a href="/services" class="text-blue-500 hover:underline">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block align-middle" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 010 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Back
    </a>
</nav>
<h1>{service.name}</h1>
<h1>{service.description}</h1>
<h1>Skapare - {service.username}</h1>
<h1>Likes {service.isLikedBy.length}</h1>

<div>
  {#if !liked}
    <form action="?/addLike" method="post" style="margin-left: 20px;">
      <input type="hidden" name="serviceName" value="{service.name}">
      <input type="hidden" name="serviceId" value="{service.id}">
      <button class="bg-blue-500 text-white px-4 py-2 rounded">
          <i class="fa-regular fa-heart"></i>
      </button>                    
    </form>
  {/if}
</div>


<div>
  {#if liked}
    <form action="?/removeLike" method="post" style="margin-left: 20px;">
      <input type="hidden" name="serviceName" value="{service.name}">
      <input type="hidden" name="serviceId" value="{service.id}">
      <button class="bg-blue-500 text-white px-4 py-2 rounded">
          <i class="fa-solid fa-heart"></i>
      </button>                    
    </form>
  {/if}
</div>





