<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Collapsible from "$/lib/components/ui/collapsible/index.js";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import HouseIcon from "@lucide/svelte/icons/house";
  import User from "@lucide/svelte/icons/user";

  interface Props {
    authors: (string | null)[];
  }
  let { authors }: Props = $props();

  export const navData = {
    nav: [
      {
        title: "Library",
        url: "/",
        icons: HouseIcon,
        items: [
          {
            title: "To-Read",
            url: "/?status=to-read",
          },
          {
            title: "Reading",
            url: "/?status=reading",
          },
          {
            title: "Finished",
            url: "/?status=finished",
          },
          {
            title: "Dropped",
            url: "/?status=dropped",
          },
        ],
      },
      {
        title: "Authors",
        url: "#",
        icons: User,
        items: authors
          .filter((a) => a !== null)
          .map((author) => ({
            title: author,
            url: `/?author=${encodeURIComponent(author)}`,
          })),
      },
    ],
  };
</script>

<Sidebar.Root>
  <Sidebar.Header class="py-4">
    <h1
      class="text-center scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Katalogue
    </h1>
  </Sidebar.Header>
  <Sidebar.Content class="gap-0">
    {#each navData.nav as item (item.title)}
      <Collapsible.Root title={item.title} open class="group/collapsible">
        <Sidebar.Group>
          <Sidebar.GroupLabel
            class="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
          >
            {#snippet child({ props })}
              <Collapsible.Trigger {...props}>
                <item.icons class="mr-2" />
                {item.title}
                <ChevronRightIcon
                  class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                />
              </Collapsible.Trigger>
            {/snippet}
          </Sidebar.GroupLabel>
          <Collapsible.Content>
            <Sidebar.GroupContent>
              <Sidebar.Menu class="px-6">
                {#each item.items as subItem (subItem.title)}
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton>
                      {#snippet child({ props })}
                        <a href={subItem.url} {...props}>
                          <span>{subItem.title}</span>
                        </a>
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                {/each}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Collapsible.Content>
        </Sidebar.Group>
      </Collapsible.Root>
    {/each}
  </Sidebar.Content>
</Sidebar.Root>
