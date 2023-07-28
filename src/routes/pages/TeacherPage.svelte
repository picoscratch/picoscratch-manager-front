<script>
  import Card from "../Card.svelte";
	import Page from "../Page.svelte";
  import Profile from "../Profile.svelte";
	import Add_Filled from "svelte-fluentui-icons/icons/Add_Filled.svelte";
</script>

<Page navitemsIndex=0 ref="teacherpage">
	<Card>
		<Profile username="Admin" />
	</Card>
	<Card>
		<Profile username="Admin" />
	</Card>
	<Card>
		<button>
			<Add_Filled size="40" />
		</button>
	</Card>
</Page>

<style>
	:global([ref="teacherpage"]) {
		display: flex;
		flex-direction: row;
		gap: 10px;
	}
</style>