<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    export let data: PageData;
    $: activity = data.activity;
    $: user = data.user;
</script>

<nav class="ml-4">
    <a href="/activities" class="text-blue-500 hover:underline">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block align-middle" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 010 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Back
    </a>
</nav>

<h1>{activity.name}</h1>
<h1>{activity.description}</h1>
<h1>{activity.estTime}</h1>
<h1>{activity.username}</h1>
<h1>{activity.activityPoints}</h1>

<form method="POST" class="flex flex-col" action="?/claimPoints" use:enhance>
  <input type="hidden" value="{activity.activityPoints}" name="activityPoints">
  <button class="mt-4 mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2">Claim points - <span class="text-orange-400 text-xl">{activity.activityPoints}</span></button>
</form>

<h1>{user?.personalPoints}</h1>


