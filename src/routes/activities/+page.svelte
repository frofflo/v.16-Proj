<script lang="ts">
    import { enhance } from '$app/forms';
    import { onDestroy } from 'svelte';
    import type { PageData } from './$types';
    import { browser } from '$app/environment';
    import { invalidateAll } from '$app/navigation';
    
    export let data: PageData;
    export let form;
    $: username = data.username;
    $: activities = data?.activityList ?? [];
    let activityPoints = 1;

    if (browser) {
        let interval: NodeJS.Timeout;

        interval = setInterval(invalidateAll, 1000) ; null;

        onDestroy(() => {
            clearInterval(interval);
            invalidateAll();
        });
    }   
    
    function isFav(activity: any, username: string|undefined): boolean {
        if (!username) return false;
        if (!activity.isFavoritedBy) return false;
        for (let i = 0; i < activity.isFavoritedBy.length; i++) {
            if (activity.isFavoritedBy[i].name == username) {
                return true;
            }
        }
        return false
    }
</script>


<nav class="ml-4">
    <a href="/" class="text-blue-500 hover:underline">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block align-middle" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 010 2H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Back
    </a>
</nav>
<div class="flex justify-evenly" style="height: 100vh; width: 100vw;">
    <div class="flex flex-row justify-center " style="margin-top:5vh; width:30%;">
        <div class="flex flex-col items-center" style=" width: 80%;">
            <h1 class="text-2xl font-bold mb-4 flex flex-col items-center bg-indigo-600 rounded-md p-2">Skapa aktivitet</h1>
            <form class="form bg-glass rounded-lg p-4" action="?/create" method="post" use:enhance style="width: 120%; height: 70%;">
                <div class="flex flex-col items-center justify-evenly" style="height: 100%;">
                    <h2 class="ml-5">Namn på aktivitet</h2>
                    <input class="input mb-2" type="text" name="activityName" placeholder="Namn på aktivitet">
                    <h2 class="ml-5">Beskrivning utav övningen</h2>
                    <input class="input mb-2" type="text" name="description" placeholder="Beskrivning">
                    <h2 class="ml-5">Tid som övningen kommer ta</h2>
                    <input class="input mb-2" type="number" name="estTime" placeholder="Ungefärlig tid (min)">
                    <label class="ml-5" for="activityPoints">Hur många poäng ska den ge? : <span class="text-xl">{activityPoints}</span></label>
                    <input class="input mb-2" type="range" name="activityPoints" min="1" max="5" placeholder="Antal poäng" bind:value={activityPoints} >
                    <button class="bg-blue-500 text-white px-4 py-2 rounded w-full">Skapa Aktivitet</button>
                    {#if form?.activityName}
                        <span>{form.activityName}</span>
                    {/if}
                </div>
            </form>
        </div>
    </div>
    <div class="flex flex-row justify-center " style="margin-top:5vh; width:30%;">
        <div class="flex flex-col items-center" style=" width: 100%;">
            <h1 class="text-2xl font-bold mb-4 flex flex-col items-center bg-yellow-600 rounded-md p-2">Favoriter</h1>
            <div class="border-solid border-4 border-indigo-600 bg-indigo-900 rounded-lg" style="width: 90%; height: 70%; overflow-y:scroll;">
                <ul class="flex flex-col items-start justify-evenly ml-10 mt-5 mb-5">
                    {#each activities as activity}
                    {#if isFav(activity, username)}
                        <div class="flex flex-row items-center justify-between p-2 rounded-md" style="margin-bottom:10px; width: 90%; background-color: rgba(0, 0, 0, 0.3);">
                            <li><a class="hover:text-sky-500" href="/activities/{activity.name}">{activity.name} - <span class="text-yellow-500 text-xl">{activity.activityPoints}</span> poäng</a></li>
                            <form action="?/removeFavorite" method="post" style="margin-left: 20px;">
                                <input type="hidden" name="activityName" value="{activity.name}">
                                <input type="hidden" name="activityId" value="{activity.id}">
                                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                                    <i class="fa-solid fa-star"></i>
                                </button>                    
                            </form>
                        </div>
                    {/if}
                    {/each}
                </ul>
            </div>
        </div>
    </div>
    <div class="flex flex-row justify-center " style="margin-top:5vh; width:30%;">
        <div class="flex flex-col items-center" style=" width: 100%;">
            <h1 class="text-2xl font-bold mb-4 flex flex-col items-center bg-purple-600 rounded-md p-2">Utforska</h1>
            <div class="border-solid border-4 border-indigo-600 bg-indigo-900 rounded-lg" style="width: 90%; height: 70%; overflow-y:scroll;">
                <ul class="flex flex-col items-start justify-evenly ml-10 mt-5 mb-5">
                    {#each activities as activity}
                    {#if !isFav(activity, username)}
                        <div class="flex flex-row items-center justify-between p-2 rounded-md" style="margin-bottom:10px; width: 90%; background-color: rgba(0, 0, 0, 0.3);">
                            <li><a class="hover:text-sky-500" href="/activities/{activity.name}">{activity.name} - <span class="text-yellow-500 text-xl">{activity.activityPoints}</span> poäng</a></li>
                            <form action="?/addFavorite" method="post" style="margin-left: 20px;">
                                <input type="hidden" name="activityName" value="{activity.name}">
                                <input type="hidden" name="activityId" value="{activity.id}">
                                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                                    <i class="fa-regular fa-star"></i>
                                </button>                    
                            </form>
                        </div>
                    {/if}
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>