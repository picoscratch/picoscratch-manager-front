<script>
  export let selected;
</script>

<button class={selected ? "selected" : ""} on:click>
  <slot />
</button>

<style>
  button {
    border: none;
    background-color: #2e2e2e;
    border-radius: 0;
    padding: 50px;
    padding-left: 30px;
    padding-right: 30px;
    height: unset;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .selected {
    background-color: #3f3f3f;
  }
</style>
