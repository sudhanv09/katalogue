<script lang="ts">
    import { Button, buttonVariants } from "$lib/shad/ui/button";
    import * as Dialog from "$lib/shad/ui/dialog";
    import { Label } from "$lib/shad/ui/label";
    import { Trash } from "lucide-svelte";
    import { Checkbox } from "$lib/shad/ui/checkbox";
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";

    // biome-ignore lint/style/useConst: <explanation>
    let checked = true;
    const pageUrl = $page.url.pathname;
    const id = pageUrl.split("/")[2];

    const handleDelete = async () => {
        const url = `http://localhost:5050/library/remove?id=${id}&includeFile=${checked}`;
        
        const req = await fetch(url, {
            method: "DELETE"
        });

        if (req.ok) {
            toast.success("File deleted");
        } else {
            toast.error("Something went wrong.");
        }

        goto("/");
    };
</script>

<Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "default" })}
        ><Trash class="w-4 h-4 mx-2 text-red-400" />Delete</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Confirm</Dialog.Title>
            <Dialog.Description
                >This action will remove this book.</Dialog.Description
            >
        </Dialog.Header>
        <div class="flex items-center space-x-2">
            <Checkbox id="terms" bind:checked aria-labelledby="terms-label" />
            <Label
                id="terms-label"
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Delete from the disk
            </Label>
        </div>
        <Dialog.Footer>
            <Button type="submit" on:click={handleDelete}>Delete</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
