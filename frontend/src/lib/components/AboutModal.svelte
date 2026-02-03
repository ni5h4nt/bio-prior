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
  <div class="overlay" on:click={close} on:keydown={handleKeydown} role="presentation">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1" on:click|stopPropagation on:keydown|stopPropagation>
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
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: #1a1a2e;
    padding: 2.5rem;
    border-radius: 16px;
    max-width: 520px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #f0f0f0;
    border: none;
    font-size: 1.25rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .close:hover {
    background: #e0e0e0;
    color: #333;
  }

  h2 {
    margin-top: 0;
    color: #1a1a2e;
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  h3 {
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    color: #2d3748;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  h3::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1em;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }

  p {
    color: #4a5568;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  strong {
    color: #2d3748;
  }

  em {
    color: #667eea;
    font-style: normal;
    font-weight: 500;
  }

  ul {
    padding-left: 1.25rem;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
    color: #4a5568;
    line-height: 1.6;
  }

  li strong {
    color: #2d3748;
  }

  .footer {
    margin-top: 2rem;
    padding-top: 1.25rem;
    border-top: 1px solid #e2e8f0;
    font-size: 0.875rem;
    color: #718096;
    text-align: center;
  }
</style>
