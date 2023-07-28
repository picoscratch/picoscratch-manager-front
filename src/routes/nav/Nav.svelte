<script lang="ts">
  import { page } from "$app/stores";
  import NavItem from "./NavItem.svelte";
  import { navItems, myProfile, schooldata } from "../stores";
  import { onDestroy } from "svelte";
  let isAdmin = false;
  let navPosition = "open";
  $: {
    if($myProfile.username.toLowerCase() == "admin") {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
  }

  if(window.innerWidth < 900) {
    console.log("mobile");
    let touchendX: number;
    let touchstartX: number;
    let touchendY: number;
    let touchstartY: number;

    function handleTouchStart(e: TouchEvent) {
      touchstartX = e.changedTouches[0].screenX;
      touchstartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e: TouchEvent) {
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;
      handleGesture();
    }

    window.addEventListener("touchstart", handleTouchStart);

    window.addEventListener("touchend", handleTouchEnd);


    async function handleGesture() {
      if(touchendX < touchstartX) {
        navPosition = "closing";
        await new Promise(r => setTimeout(r, 800));
        navPosition = "closed";
      }

      if(touchendX > touchstartX) {
        navPosition = "open";
      }
    }

    onDestroy(() => {
      window.removeEventListener("touchstart", handleTouchStart);

      window.removeEventListener("touchend", handleTouchEnd);
    })
  }
</script>

<div id="nav" class={navPosition}>
  {#each navItems as item}
    {#if !(item.adminOnly && !isAdmin)}
      <NavItem {...item} />
    {/if}
  {/each}
  {#if schooldata != undefined}
    {#each $schooldata.courses as course}
      <NavItem arrow={true} text={course.name} url={"course/" + course.uuid} prefetch={false} />
    {/each}
  {/if}
  <!-- div is used to get the navitems after it to the bottom -->
  <div id="nav-bottom"></div>
  <NavItem text="Log out" url="logout" />
</div>

<style>
  #nav {
    background-color: rgba(29, 29, 29, 0.5);
    backdrop-filter: blur(15px);
    padding: 10px;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
    width: 20%;
    border: 2px solid rgba(46, 46, 46, 0.8);
    border-left: none;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    height: 85vh;
    animation: slideIn 800ms forwards ease-in-out;
    z-index: 999;
  }

  #nav-bottom {
    flex-grow: 1;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0%);
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(-100%);
    }
  }

  @media(max-width: 900px) {
    #nav {
      position: fixed;
      /* display: none; */
      width: 80%;
    }
    .closed {
      display: none !important;
    }
    .closing {
      animation: slideOut 800ms forwards ease-in-out !important;
    }
  }
</style>
