<script>
	import './styles.css';
</script>

<div class="app">
  <div class="content">
	  <main>
			<slot></slot>
	  </main>
  </div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-left: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

  .content {
    display: flex;
  }
</style>
