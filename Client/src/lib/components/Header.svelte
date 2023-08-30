<script>

	import { FileButton } from "@skeletonlabs/skeleton";
    import {handleFileUpload} from "../FileUpload";

</script>

<div class="w-full flex justify-end">
    <FileButton name="files" button="btn variant-filled" on:change={handleFileUpload} multiple accept=".epub"> Add</FileButton>
</div>