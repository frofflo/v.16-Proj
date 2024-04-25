<script>
	export let data;

	$: username = data.username;
</script>


<div class="flex flex-col items-center justify-evenly">
	<div style="margin-top:10vh;">
		<h1 class="text-4xl font-bold">Välkommen, {username}!</h1>
	</div>
	<div class="flex flex-col items-center" style="margin-top:20vh;">
		<a href="/services" class="btn rounded-lg bg-green-500">Tjänster</a>
	</div>
</div>

