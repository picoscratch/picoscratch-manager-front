<script lang="ts">
  import { page } from "$app/stores";
  import NavItem from "./NavItem.svelte";
  import { myProfile, schooldata, navPosition } from "../../stores/stores";
  import { onDestroy } from "svelte";
  import SettingsIcon from "svelte-fluentui-icons/icons/Settings_Filled.svelte";
  import SignOutIcon from "svelte-fluentui-icons/icons/SignOut_Filled.svelte";
  import PersonIcon from "svelte-fluentui-icons/icons/Person_Filled.svelte";
  import PeopleTeamIcon from "svelte-fluentui-icons/icons/PeopleTeam_Filled.svelte";
  import RoomIcon from "svelte-fluentui-icons/icons/ConferenceRoom_Filled.svelte";
  import HatGraduationIcon from "svelte-fluentui-icons/icons/HatGraduation_Filled.svelte";
  import CodeIcon from "svelte-fluentui-icons/icons/Code_Filled.svelte";
  import BeakerIcon from "svelte-fluentui-icons/icons/Beaker_Filled.svelte";
  let isAdmin = false;
  // let navPosition = "open";
  $: {
    if($myProfile.username.toLowerCase() == "admin") {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
  }

  // if(window.innerWidth < 900) {
  //   console.log("mobile");
  //   let touchendX: number;
  //   let touchstartX: number;
  //   let touchendY: number;
  //   let touchstartY: number;

  //   function handleTouchStart(e: TouchEvent) {
  //     touchstartX = e.changedTouches[0].screenX;
  //     touchstartY = e.changedTouches[0].screenY;
  //   }

  //   function handleTouchEnd(e: TouchEvent) {
  //     touchendX = e.changedTouches[0].screenX;
  //     touchendY = e.changedTouches[0].screenY;
  //     handleGesture();
  //   }

  //   window.addEventListener("touchstart", handleTouchStart);

  //   window.addEventListener("touchend", handleTouchEnd);


  //   async function handleGesture() {
  //     if(touchendX < touchstartX) {
  //       navPosition = "closing";
  //       await new Promise(r => setTimeout(r, 800));
  //       navPosition = "closed";
  //     }

  //     if(touchendX > touchstartX) {
  //       navPosition = "open";
  //     }
  //   }

  //   onDestroy(() => {
  //     window.removeEventListener("touchstart", handleTouchStart);

  //     window.removeEventListener("touchend", handleTouchEnd);
  //   })
  // }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="nav" class={$navPosition} on:click={async () => {
  $navPosition = "closing";
  await new Promise(r => setTimeout(r, 800));
  $navPosition = "closed";
}}>
  <!-- {#each navItems as item}
    {#if !(item.adminOnly && !isAdmin)}
      <NavItem {...item} />
    {/if}
  {/each} -->
  <NavItem url="teachers">
    <PeopleTeamIcon />
    Lehrer
  </NavItem>
  <NavItem url="rooms">
    <RoomIcon />
    Räume
  </NavItem>
  <NavItem url="courses">
    <HatGraduationIcon />
    Kurse
  </NavItem>
  {#if schooldata != undefined}
    {#each $schooldata.courses as course}
      <NavItem arrow={true} url={"course/" + course.uuid} prefetch={false}>
        {#if course.courseType == "coding"}
          <CodeIcon />
        {:else}
          <BeakerIcon />
        {/if}
        {course.name}
      </NavItem>
    {/each}
  {/if}
  <!-- div is used to get the navitems after it to the bottom -->
  <div id="nav-bottom"></div>
  <NavItem url="profile">
    <PersonIcon />
    Profil
  </NavItem>
  <NavItem url="settings">
    <SettingsIcon />
    Einstellungen
  </NavItem>
  <NavItem url="logout">
    <SignOutIcon />
    Abmelden
  </NavItem>
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
    view-transition-name: nav;
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
