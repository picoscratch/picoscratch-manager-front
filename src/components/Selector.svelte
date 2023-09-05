<div class="selector">
  <slot />
</div>

<style>
  div {
    display: flex;
    overflow: hidden;
    border-radius: 15px;
  }
  :global(div.selector button:not(div.selector button:last-of-type)) {
    border-right: 5px solid #1d1d1d;
  }
</style>
