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

      <h2 id="modal-title">Understanding the Autistic Experience</h2>

      <div class="intro">
        <p>
          This simulation helps neurotypical people understand how some autistic individuals
          experience the world — not as a "disorder," but as a different way of processing information.
        </p>
      </div>

      <h3>🧠 The Science: Predictive Coding</h3>
      <p>
        Your brain constantly predicts what it expects to see, hear, and feel. When reality
        matches the prediction, the signal is filtered out. When it doesn't match, the
        difference (called <em>prediction error</em>) gets amplified.
      </p>

      <h3>⚡ The HIPPE Theory</h3>
      <p>
        Research suggests that many autistic brains assign higher <em>precision</em> to
        incoming sensory signals. This means:
      </p>
      <ul>
        <li>Every detail gets amplified — the clock ticking, the fabric texture, the fluorescent hum</li>
        <li>The brain works harder to process all this information</li>
        <li>What feels "normal" to neurotypical people can feel overwhelming</li>
      </ul>

      <h3>🎧 Why "Stimming" Helps</h3>
      <p>
        When the brain is overwhelmed, self-regulation strategies (often called "stimming")
        aren't misbehavior — they're the brain protecting itself:
      </p>
      <ul>
        <li><strong>Reduce Input:</strong> Headphones, dimmed lights, or closing eyes reduces incoming signals</li>
        <li><strong>Rhythmic Motion:</strong> Rocking or tapping creates predictable patterns the brain can handle</li>
        <li><strong>Taking a Break:</strong> Leaving the overwhelming environment lets the system reset</li>
      </ul>

      <div class="key-message">
        <span class="quote">"</span>
        <p>
          When a child covers their ears, rocks, or needs to leave the room — they're not
          misbehaving. Their nervous system is overloaded, and these are <strong>solutions</strong>,
          not problems.
        </p>
      </div>

      <h3>📚 Learn More</h3>
      <p>
        This simulation is based on the <em>High Individual Posterior Predictive Error</em> (HIPPE)
        theory of autism. Search for "predictive coding autism" to explore the research.
      </p>

      <p class="footer">
        Built with care to foster understanding
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
    padding: 1rem;
  }

  .modal {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: #1a1a2e;
    padding: 2rem;
    border-radius: 16px;
    max-width: 560px;
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
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    padding-right: 2rem;
  }

  .intro {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid #bfdbfe;
  }

  .intro p {
    margin: 0;
    color: #1e40af;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: #2d3748;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    color: #4a5568;
    line-height: 1.7;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
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
    margin: 0.5rem 0;
  }

  li {
    margin-bottom: 0.5rem;
    color: #4a5568;
    line-height: 1.5;
    font-size: 0.9rem;
  }

  li strong {
    color: #2d3748;
  }

  .key-message {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    position: relative;
    border: 1px solid #fbbf24;
  }

  .key-message .quote {
    position: absolute;
    top: -0.25rem;
    left: 0.75rem;
    font-size: 3rem;
    color: #f59e0b;
    opacity: 0.5;
    font-family: Georgia, serif;
    line-height: 1;
  }

  .key-message p {
    margin: 0;
    color: #92400e;
    font-size: 0.95rem;
    padding-left: 1rem;
  }

  .key-message strong {
    color: #78350f;
  }

  .footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    font-size: 0.8rem;
    color: #94a3b8;
    text-align: center;
  }
</style>
