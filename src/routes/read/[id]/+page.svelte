<script lang="ts">
  import type { PageProps } from "./$types";
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  
  let { data }: PageProps = $props();
  
  let contentContainer: HTMLElement;
  let currentPage = $state(0);
  let totalPages = $state(0);
  let isCalculating = $state(false);
  
  async function calculatePages() {
    if (!contentContainer) return;
    
    isCalculating = true;
    await tick();
    
    const containerHeight = contentContainer.clientHeight;
    const contentHeight = contentContainer.scrollWidth;
    totalPages = Math.max(1, Math.ceil(contentHeight / containerHeight));
    
    if (data.item.currentPage !== undefined && data.item.currentPage >= 0) {
      currentPage = Math.min(data.item.currentPage, totalPages - 1);
    } else {
      currentPage = 0;
    }
    
    isCalculating = false;
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
      const padding = getHorizontalPadding(contentContainer);
      contentContainer.scrollLeft += contentContainer.clientWidth - padding + 32;
      // await savePosition();
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
      const padding = getHorizontalPadding(contentContainer);
      contentContainer.scrollLeft -= contentContainer.clientWidth - padding;
      // await savePosition();
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
    class="px-8 py-6 columns-2 gap-8 h-full overflow-x-auto"
  >
    {@html data.item.chapter.html}
  </section>
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
