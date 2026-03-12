<script lang="ts">
  import type { PageProps } from "./$types";
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  
  let { data }: PageProps = $props();
  
  let contentContainer: HTMLElement;
  let currentPage = $state(0);
  let totalPages = $state(0);

  function pageWidth() {
    if (!contentContainer) return 0;
    const padding = getHorizontalPadding(contentContainer);
    return contentContainer.clientWidth - padding + 32;
  }

  function applyCurrentPageScroll() {
    if (!contentContainer) return;
    contentContainer.scrollLeft = pageWidth() * currentPage;
  }
  
  async function calculatePages() {
    if (!contentContainer) return;
    await tick();
    
    const containerHeight = contentContainer.clientHeight;
    const contentHeight = contentContainer.scrollWidth;
    totalPages = Math.max(1, Math.ceil(contentHeight / containerHeight));
    
    if (data.item.currentPage !== undefined && data.item.currentPage >= 0) {
      currentPage = Math.min(data.item.currentPage, totalPages - 1);
    } else {
      currentPage = 0;
    }

    applyCurrentPageScroll();
  }

  function getHorizontalPadding(el: HTMLElement) {
    const style = getComputedStyle(el);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    return paddingLeft + paddingRight;
  }

  
  async function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      applyCurrentPageScroll();
      await savePosition();
    } else {
      const toc = data.item.toc;
      const currentId = data.item.chapter.id;
      const index = toc.findIndex((c) => c.id === currentId);
      if (index < toc.length - 1) {
        await savePosition();
        goto(`?id=${toc[index + 1].id}`);
      }
    }
  }
  
  async function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      applyCurrentPageScroll();
      await savePosition();
    } else {
      const toc = data.item.toc;
      const currentId = data.item.chapter.id;
      const index = toc.findIndex((c) => c.id === currentId);
      if (index > 0) {
        await savePosition();
        goto(`?id=${toc[index - 1].id}&goToEnd=true`);
      }
    }
  }
  
  async function savePosition() {
    try {
      await fetch(`/api/book/${data.bookId}/position`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: data.item.chapter.id,
          page: currentPage
        })
      });
    } catch (err) {
      console.error('Failed to save position:', err);
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevPage();
    } else if (e.key === 'q') {
      e.preventDefault();
      goto('/');
    }
  }
  
  $effect(() => {
    if (data.item.chapter.html) {
      calculatePages();
    }
  });
  
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('goToEnd') === 'true') {
      const interval = setInterval(() => {
        if (totalPages > 0) {
          currentPage = totalPages - 1;
          applyCurrentPageScroll();
          savePosition();
          clearInterval(interval);
          const newUrl = window.location.pathname + '?id=' + params.get('id');
          window.history.replaceState({}, '', newUrl);
        }
      }, 50);
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="relative h-[calc(100vh-52px)]">
  <section
    bind:this={contentContainer}
    class="px-8 py-6 columns-2 gap-8 h-[calc(100%-36px)] overflow-x-auto"
  >
    {@html data.item.chapter.html}
  </section>

  <footer class="h-9 flex items-center px-8 text-xs text-muted-foreground border-t">
    <span>{currentPage + 1} / {totalPages}</span>
  </footer>
</div>

<style>
  section :global(img) {
    max-width: 100%;
    max-height: 90vh;
    height: auto;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }

  section :global(svg) {
    max-width: 100%;
    max-height: 90vh;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  section :global(div) {
    max-width: 100%;
  }
</style>
