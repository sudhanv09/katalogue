<script lang="ts">
	import '$src/app.postcss';
</script>

<div>
	<a href="/">Home</a>
	<div class="columns-3 leading-relaxed whitespace-normal text-ellipsis h-screen w-full overflow-x-scroll">
		<slot />
	</div>
</div>

