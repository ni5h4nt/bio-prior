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
    <div
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      on:click|stopPropagation
      on:keydown|stopPropagation
    >
      <header class="drawer-header">
        <h2 id="drawer-title">Understanding the Experience</h2>
        <button class="close" on:click={close} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <div class="drawer-content">
        <div class="intro-card">
          <p>
            This simulation helps neurotypical people understand how some autistic individuals
            experience the world — not as a "disorder," but as a <strong>different way of processing information</strong>.
          </p>
        </div>

        <section class="section">
          <div class="section-header">
            <span class="section-icon">💡</span>
            <h3>Why "BioPrior"?</h3>
          </div>
          <div class="section-body">
            <p>
              In Bayesian neuroscience, a <em>prior</em> is the brain's expectation about what it will
              perceive — a prediction based on past experience.
            </p>
            <div class="concept-box">
              <div class="concept-term">Bio + Prior</div>
              <div class="concept-def">Biological priors encoded in your neural circuits that help filter out unimportant details</div>
            </div>
            <p>
              This simulation shows what happens when the brain weighs raw sensory input more heavily
              than its priors — when <strong>every detail demands equal attention</strong>.
            </p>
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <span class="section-icon">🧠</span>
            <h3>Predictive Coding</h3>
          </div>
          <div class="section-body">
            <p>
              Your brain constantly predicts what it expects to see, hear, and feel.
            </p>
            <div class="two-col">
              <div class="col match">
                <div class="col-label">Reality matches prediction</div>
                <div class="col-result">Signal filtered out</div>
              </div>
              <div class="col mismatch">
                <div class="col-label">Reality differs</div>
                <div class="col-result">Prediction error amplified</div>
              </div>
            </div>
          </div>
        </section>

        <section class="section highlight">
          <div class="section-header">
            <span class="section-icon">⚡</span>
            <h3>The HIPPE Theory</h3>
          </div>
          <div class="section-body">
            <p>
              Research suggests that many autistic brains assign higher <em>precision</em> to
              incoming sensory signals:
            </p>
            <ul class="impact-list">
              <li>
                <span class="impact-icon">🔊</span>
                <span>Every detail gets amplified — clock ticking, fabric texture, fluorescent hum</span>
              </li>
              <li>
                <span class="impact-icon">⚙️</span>
                <span>The brain works harder to process all this information</span>
              </li>
              <li>
                <span class="impact-icon">😰</span>
                <span>What feels "normal" to neurotypical people can feel overwhelming</span>
              </li>
            </ul>
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <span class="section-icon">🎧</span>
            <h3>Why Regulation Helps</h3>
          </div>
          <div class="section-body">
            <p>
              When the brain is overwhelmed, self-regulation strategies (often called "stimming")
              aren't misbehavior — they're the brain <strong>protecting itself</strong>:
            </p>
            <div class="strategy-cards">
              <div class="strategy">
                <div class="strategy-name">Reduce Input</div>
                <div class="strategy-desc">Headphones, dimmed lights, closing eyes</div>
              </div>
              <div class="strategy">
                <div class="strategy-name">Rhythmic Motion</div>
                <div class="strategy-desc">Rocking or tapping creates predictable patterns</div>
              </div>
              <div class="strategy">
                <div class="strategy-name">Taking a Break</div>
                <div class="strategy-desc">Leaving the environment lets the system reset</div>
              </div>
            </div>
          </div>
        </section>

        <div class="key-message">
          <div class="quote-mark">"</div>
          <p>
            When a child covers their ears, rocks, or needs to leave the room — they're not
            misbehaving. Their nervous system is overloaded, and these are <strong>solutions</strong>,
            not problems.
          </p>
        </div>

        <section class="section learn-more">
          <div class="section-header">
            <span class="section-icon">📚</span>
            <h3>Learn More</h3>
          </div>
          <div class="section-body">
            <p>
              This simulation is based on the <em>High Individual Posterior Predictive Error</em> (HIPPE)
              theory of autism.
            </p>
            <div class="search-hint">
              Search: <code>predictive coding autism</code>
            </div>
          </div>
        </section>

        <footer class="drawer-footer">
          Built with care to foster understanding
        </footer>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 100;
    backdrop-filter: blur(2px);
  }

  .drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 420px;
    max-width: 90vw;
    background: #ffffff;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .drawer-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .intro-card {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid #bfdbfe;
  }

  .intro-card p {
    margin: 0;
    color: #1e40af;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .section {
    margin-bottom: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .section.highlight {
    border-color: #c4b5fd;
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  .section.highlight .section-header {
    background: rgba(139, 92, 246, 0.1);
    border-bottom-color: #c4b5fd;
  }

  .section-icon {
    font-size: 1.25rem;
  }

  .section-header h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
  }

  .section-body {
    padding: 1rem;
  }

  .section-body p {
    margin: 0 0 0.75rem;
    color: #4b5563;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .section-body p:last-child {
    margin-bottom: 0;
  }

  em {
    color: #7c3aed;
    font-style: normal;
    font-weight: 600;
  }

  strong {
    color: #1f2937;
  }

  .concept-box {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin: 0.75rem 0;
  }

  .concept-term {
    font-weight: 700;
    color: #667eea;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .concept-def {
    color: #6b7280;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }

  .col {
    padding: 0.75rem;
    border-radius: 8px;
    text-align: center;
  }

  .col.match {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
  }

  .col.mismatch {
    background: #fef2f2;
    border: 1px solid #fecaca;
  }

  .col-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  .col-result {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .col.match .col-result {
    color: #059669;
  }

  .col.mismatch .col-result {
    color: #dc2626;
  }

  .impact-list {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
  }

  .impact-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9d5ff;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .impact-list li:last-child {
    border-bottom: none;
  }

  .impact-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .strategy-cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .strategy {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .strategy-name {
    font-weight: 600;
    font-size: 0.85rem;
    color: #1f2937;
    min-width: 100px;
  }

  .strategy-desc {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .key-message {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    margin: 1.5rem 0;
    position: relative;
    border: 1px solid #fbbf24;
  }

  .quote-mark {
    position: absolute;
    top: 0.25rem;
    left: 0.75rem;
    font-size: 3rem;
    color: #f59e0b;
    opacity: 0.4;
    font-family: Georgia, serif;
    line-height: 1;
  }

  .key-message p {
    margin: 0;
    color: #92400e;
    font-size: 0.95rem;
    line-height: 1.6;
    padding-left: 1.5rem;
  }

  .key-message strong {
    color: #78350f;
  }

  .learn-more {
    background: #f9fafb;
  }

  .search-hint {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .search-hint code {
    background: #f3f4f6;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 0.85rem;
    color: #7c3aed;
  }

  .drawer-footer {
    padding: 1rem 1.5rem;
    text-align: center;
    font-size: 0.8rem;
    color: #9ca3af;
    border-top: 1px solid #e5e7eb;
  }

  @media (max-width: 480px) {
    .drawer {
      width: 100vw;
      max-width: 100vw;
    }

    .two-col {
      grid-template-columns: 1fr;
    }
  }
</style>
