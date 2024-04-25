<script lang="ts">
    import { browser } from "$app/environment";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { Stepper, Step, SlideToggle } from '@skeletonlabs/skeleton';
    import { onDestroy, onMount } from "svelte";
  
    export let form;

    function onCompleteHandler(e: Event): void { 
        console.log('event:complete', e); 

        const formElement = document.querySelector('form');
        if (formElement) {
            formElement.submit();
        }
    }

    function onStepHandler(e: {detail: {state: {current: number, total: number}, step: number}}): void {
	    console.log('event:step', e);
    }

    let username = "";
    let password = "";
    let repeatedPassword = "";
    let mail = "";
    let village = "";
    let ageGroup = "";
    let gender = "";

    let btnClick: HTMLButtonElement;

    if (browser) {
        let interval: NodeJS.Timeout;

        interval = setInterval(invalidateAll, 50) ; null;

        onDestroy(() => {
            clearInterval(interval);
            invalidateAll();
        });
    }   

</script>

<div class="flex flex-col justify-evenly items-center min-h-screen">
    <div>
        <h1 class="text-6xl font-bold" style="margin-top:-25vh;">Register</h1>
    </div>
    <div class="bg-blue-200 rounded-lg p-8 variant-glass-surface w-1/4" style="margin-top:-40vh;">
        <Stepper
        on:complete={() => {
            console.log('complete');
            btnClick.click();
        }}
        >
            <Step locked={form?.username_taken == true || username.length<4 || form?.username != username} buttonBack="invisible">
                <label>
                    Username
                    <input class="input" bind:value={username} name="username" type="text">
                </label>
                <form class="flex flex-row justify-center" method="POST" action="?/usernameCheck" use:enhance>
                    <input type="hidden" name="username" value={username}>
                        <button class="btn variant-filled">Check Availability</button>
                </form>
                {#if form?.username_taken == true  && form?.username == username}
                    <p style="color:red">Username is already taken</p>
                {/if}
                {#if form?.username_taken == false && username.length>=4 && form?.username == username}
                    <p style="color:lime">Username is available</p>
                {/if}
                {#if username.length<4 && username.length>0}
                    <p style="color:red">Username must be at least 4 characters long</p>
                {/if}
                {#if username.length == 0}
                    <p style="color:red">Please supply a username</p>
                {/if}
                
            </Step>
            <Step locked={password.length<6 || password != repeatedPassword}>
                <label>
                    Password
                    <input class="input" bind:value={password} name="password" type="password" >
                </label>
                <label>
                    Repeat password
                    <input class="input" bind:value={repeatedPassword} name="repeatedPassword" type="password">
                </label>
            </Step>
            <Step>
                <label>
                    Gender
                    <select class="input" bind:value={gender} name="gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </label>
                <label>
                    Age Group
                    <select class="input" bind:value={ageGroup} name="ageGroup">
                        <option value="0-35">0-35</option>
                        <option value="36-55">36-55</option>
                        <option value="56+">56+</option>
                    </select>
                </label>
            </Step>
            <Step locked={mail.length<10}>
                <label>
                    Village
                    <select class="input" bind:value={village} name="village">
                        <option value="male">Stöcke</option>
                        <option value="female">Degernäs</option>
                        <option value="other">Ström</option>
                    </select>
                </label>
                <label>
                    Mail
                    <input class="input" bind:value={mail} name="mail" type="text">
                </label>
            </Step>
        </Stepper>
        <br>
        <a class="mt-5" href="/Login">Already have an account?</a>
        <form method="POST" action="?/login" use:enhance>
            <input type="hidden" name="username" value={username}>
            <input type="hidden" name="ageGroup" value={ageGroup}>
            <input type="hidden" name="password" value={password}>
            <input type="hidden" name="repeatedPassword" value={repeatedPassword}>
            <input type="hidden" name="gender" value={gender}>
            <input type="hidden" name="village" value={village}>
            <input type="hidden" name="mail" value={mail}>
            <button class="hidden" bind:this={btnClick}></button>
        </form>
    </div>
</div>

<style>
    .errorMessage{
        color: red;
    }
    .input:focus {
        outline: none;
        border-color: transparent;
        box-shadow: none;
    }

</style>