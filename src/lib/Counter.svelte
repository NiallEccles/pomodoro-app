<script lang="ts">
  import { animationInterval, msToTime } from "../scripts/counter-utils";
  import { handlePermission } from "../scripts/permissions";

  let controller = new AbortController();
  const timeOptions = [
    1000 * 60 * 25, // 25 minutes
    1000 * 60 * 5, // 5 minutes
    1000 * 60 * 15, // 15 minutes
  ];
  let initialTime = timeOptions[0];
  let currentTime = initialTime;
  let formattedTime = msToTime(currentTime);
  let counterIsActive = false;

  function setTime(index: number) {
    if (!counterIsActive) {
      initialTime = timeOptions[index];
      currentTime = initialTime;
      formattedTime = msToTime(currentTime);
    }
  }

  function setState() {
    controller = new AbortController();
    initialTime = timeOptions[0];
    currentTime = initialTime;
    formattedTime = msToTime(currentTime);
    counterIsActive = false;
  }

  function toggleCounter() {
    handlePermission();
    counterIsActive = !counterIsActive;
    console.log(counterIsActive);
    if (counterIsActive) {
      animationInterval(1000, controller.signal, (time: number) => {
        console.log("tick!", time);
        if (currentTime === 0) {
          controller.abort();
          setState();
          new Notification("Pomodoro App", { body: "Timer's up!" });
        } else {
          currentTime = currentTime - 1000;
          formattedTime = msToTime(currentTime);
        }
      });
    } else {
      window.clearTimeout(window["globalTimeout"]);
    }
  }
</script>

<div class="container">
  <h1>{formattedTime}</h1>
  <ol>
    <li
      on:click={() => {
        setTime(0);
      }}
    >
      <button disabled={counterIsActive}>Pomodoro</button>
    </li>
    <li
      on:click={() => {
        setTime(1);
      }}
    >
      <button disabled={counterIsActive}>Short Break</button>
    </li>
    <li
      on:click={() => {
        setTime(2);
      }}
    >
      <button disabled={counterIsActive}>Long Break</button>
    </li>
  </ol>
  <button
    class="toggle {counterIsActive ? 'stop' : ''}"
    on:click={toggleCounter}
  >
    {counterIsActive ? "Stop" : "Start"}
  </button>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-family: inherit;
  }
  h1 {
    font-size: 4em;
    color: #56cef2;
    text-align: center;
  }
  ol {
    display: flex;
    list-style: none;
    padding: 0;
    background: #17122d;
    border-radius: 3em;
    align-items: center;
    justify-content: space-evenly;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
    padding: 0.5em 0.75em;
  }
  li {
    color: #56cef2;
    cursor: pointer;
    padding: 0.75em 1em;
  }
  li:hover {
    background: #56cef2;
    border-radius: 3em;
    color: #17122d;
  }
  li button {
    color: #56cef2;
    background: none;
    border: none;
    font-family: 'Open Sans', sans-serif;
  }
  li:hover button {
    color: #17122d;
    cursor: pointer;
  }
  .toggle {
    padding: 1em;
    color: #56cef2;
    background-color: transparent;
    border-radius: 2em;
    border: 2px solid #56cef2;
    cursor: pointer;
    font-size: 1.25em;
    padding: 0.45em 2em;
    font-family: inherit;
  }
  .toggle:hover{
    color: #17122d;
    background: #56cef2;
  }
  .stop {
    border: 2px solid #ff3e00;
    color: #ff3e00;
  }

  .stop:hover {
    background: #ff3e00;
  }
</style>
