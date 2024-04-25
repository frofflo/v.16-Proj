<script lang="ts">
    import { enhance } from '$app/forms';
    import { onDestroy } from 'svelte';
    import type { PageData } from './$types';
    import { browser } from '$app/environment';
    import { invalidateAll } from '$app/navigation';
    
    export let data: PageData;
    export let form;
    $: username = data.username;
    $: services = data?.serviceList ?? [];

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
            <h1 class="text-2xl font-bold mb-4 flex flex-col items-center bg-indigo-600 rounded-md p-2">Skapa tjänst</h1>
            <form class="form bg-glass rounded-lg p-4" action="?/create" method="post" use:enhance style="width: 120%; height: 70%;">
                <div class="flex flex-col items-center justify-evenly" style="height: 100%;">
                    <h2 class="ml-5">Namn på tjänst</h2>
                    <input class="input mb-2" type="text" name="serviceName" placeholder="Namn på tjänst">
                    <h2 class="ml-5">Beskrivning utav tjänsten</h2>
                    <input class="input mb-2" type="text" name="description" placeholder="Beskrivning">
                    <button class="btn variant-filled w-1/2">Skapa tjänst</button>
                    {#if form?.serviceName}
                        <span>{form.serviceName}</span>
                    {/if}
                </div>
            </form>
        </div>
    </div>
    <div class="flex flex-row justify-center " style="margin-top:5vh; width:30%;">
        <div class="flex flex-col items-center" style=" width: 100%;">
            <h1 class="text-2xl font-bold mb-4 flex flex-col items-center bg-yellow-600 rounded-md p-2">Gillade Tjänster</h1>
            <div class="border-solid border-4 border-indigo-600 bg-indigo-900 rounded-lg" style="width: 90%; height: 70%; overflow-y:scroll;">
                <ul class="flex flex-col items-start justify-evenly ml-10 mt-5 mb-5">
                    {#each services as service}
                    {#if isLiked(service, username)}
                        <div class="flex flex-row items-center justify-between p-2 rounded-md" style="margin-bottom:10px; width: 90%; background-color: rgba(0, 0, 0, 0.3);">
                            <li><a class="hover:text-sky-500" href="/services/{service.name}">{service.name} - <span class="text-yellow-500 text-xl">{service.isLikedBy.length}</span> Likes </a></li>
                            <form action="?/removeLike" method="post" style="margin-left: 20px;">
                                <input type="hidden" name="serviceName" value="{service.name}">
                                <input type="hidden" name="serviceId" value="{service.id}">
                                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                                    <i class="fa-solid fa-heart"></i>
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
                    {#each services as service}
                    {#if !isLiked(service, username)}
                        <div class="flex flex-row items-center justify-between p-2 rounded-md" style="margin-bottom:10px; width: 90%; background-color: rgba(0, 0, 0, 0.3);">
                            <li><a class="hover:text-sky-500" href="/services/{service.name}">{service.name} - <span class="text-yellow-500 text-xl">{service.isLikedBy.length}</span> Likes </a></li>
                            <form action="?/addLike" method="post" style="margin-left: 20px;">
                                <input type="hidden" name="serviceName" value="{service.name}">
                                <input type="hidden" name="serviceId" value="{service.id}">
                                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                                    <i class="fa-regular fa-heart"></i>
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