<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string = 'abstract';

  const dispatch = createEventDispatcher<{
    change: { scene: string };
  }>();

  const scenes = [
    { id: 'abstract', label: 'Abstract', icon: '◆' },
    { id: 'classroom', label: 'Classroom', icon: '🏫' },
    { id: 'grocery', label: 'Grocery Store', icon: '🛒' },
    { id: 'playground', label: 'Playground', icon: '🎠' },
  ];

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    value = target.value;
    dispatch('change', { scene: value });
  }
</script>

<div class="scene-selector">
  <label for="scene-select" class="label">Scene</label>
  <select
    id="scene-select"
    {value}
    on:change={handleChange}
    aria-label="Scene"
  >
    {#each scenes as scene (scene.id)}
      <option value={scene.id}>{scene.icon} {scene.label}</option>
    {/each}
  </select>
</div>

<style>
  .scene-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: #1f2937;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.25rem;
  }

  select:hover {
    border-color: #9ca3af;
  }

  select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
</style>
