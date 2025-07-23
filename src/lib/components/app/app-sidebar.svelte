<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import HouseIcon from "@lucide/svelte/icons/house";
  import User from "@lucide/svelte/icons/user";

  const items = [
    {
      title: "Home",
      url: "/",
      icon: HouseIcon,
    },
    {
      title: "Authors",
      url: "/authors",
      icon: User,
    },
  ];
</script>

<Sidebar.Root>
  <Sidebar.Header class="py-4">
    <h1
      class="text-center scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Katalogue
    </h1>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu class="p-3 space-y-3">
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
