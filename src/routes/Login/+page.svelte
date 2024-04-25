<script lang="ts">
    import { enhance } from "$app/forms";
  
    export let form: { username?: string , password?: string} = {};

</script>

<div class="flex flex-col justify-evenly items-center min-h-screen">
    <div>
        <h1 class="text-6xl font-bold" style="margin-top:-20vh;">Login</h1>
    </div>
    <div class="bg-blue-200 rounded-lg p-8 variant-glass-surface" style="margin-top:-40vh;">
        <form method="POST" class="flex flex-col" action="?/login" use:enhance>
            <label>
                Username
                <input class="input" name="username" type="text">
            </label>
            <label>
                Password
                <input class="input" name="password" type="password">
            </label>
            {#if form?.password}
                <span class="errorMessage">{form.password}</span>
            {/if}
            <div style="width:100%" class="flex flex-row justify-center">
                <button class="btn variant-filled w-1/2 mt-4">Log in</button>
            </div>
            <br>
            <a href="/register">Don't have an account?</a>
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