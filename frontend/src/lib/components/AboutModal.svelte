<script lang="ts">
  export let open: boolean = false;

  function close() {
    open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="overlay" on:click={close} role="presentation">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" on:click|stopPropagation>
      <button class="close" on:click={close} aria-label="Close">×</button>

      <h2 id="modal-title">About bio-prior</h2>

      <p>
        <strong>bio-prior</strong> is a simulation that demonstrates how
        <em>precision weighting</em> affects sensory processing.
      </p>

      <h3>The HIPPE Theory</h3>
      <p>
        HIPPE (High Individual Posterior Predictive Error) suggests that some
        neurodivergent individuals process sensory input with higher "gain"—
        every detail is amplified, making it harder to filter background noise.
      </p>

      <h3>What You're Seeing</h3>
      <ul>
        <li><strong>Sensory Detail slider:</strong> Adjusts how much weight the brain gives to incoming signals</li>
        <li><strong>Processing Load:</strong> Shows computational cost—high precision exhausts resources</li>
        <li><strong>Regulation Strategies:</strong> Demonstrates how self-soothing behaviors actually help</li>
      </ul>

      <h3>The Message</h3>
      <p>
        When a child covers their ears, rocks, or leaves the room—they're not
        misbehaving. Their system is overloaded, and these are <em>solutions</em>,
        not problems.
      </p>

      <p class="footer">
        Built with care by Nishant Tyagi
      </p>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  h2 {
    margin-top: 0;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  ul {
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  .footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-size: 0.9rem;
    color: #666;
  }
</style>
