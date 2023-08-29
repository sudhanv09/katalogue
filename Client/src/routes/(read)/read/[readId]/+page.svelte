<script lang="ts">
	import type { PageData } from "./$types";

    export let data: PageData;
</script>

<!-- TODO Implement scrolling with spacebar
    TODO Implement scroll restore
-->
<div>
    {@html data.body}
</div>

