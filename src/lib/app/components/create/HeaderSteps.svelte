<script>
  import { cn } from '$lib/utils.js';

  export let steps = [];
  export let currentStep = 1;
  let latestRecordedStep = currentStep;
  $: latestRecordedStep = Math.max(currentStep, latestRecordedStep);

  function getStepStatus(index) {
    const stepNumber = index + 1;
    if (stepNumber < currentStep) return 'complete';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  }

  function handleStepClick(index) {
    if (latestRecordedStep < index + 1) return;
    const newStep = index + 1;
    currentStep = newStep;
  }


</script>

<div class="relative flex flex-row w-full justify-center">
	{#each steps as step, index}
		<button on:click={() => handleStepClick(index) }
						class="relative flex flex-col items-center gap-2">
			<div
				class={cn(
          "relative z-10 flex h-10 w-10 items-center rounded-md justify-center border-border bg-muted",
          getStepStatus(index) === "complete" && " bg-primary text-primary-foreground",
          getStepStatus(index) === "current" && "border-primary border-2",
        )}
			>
				<svelte:component
					this={step.icon}
					class={cn(
              "h-6 w-6",
              getStepStatus(index) === "current" && "text-primary animate-pulse",
              getStepStatus(index) === "upcoming" && "text-muted-foreground"
            )}
				/>
			</div>


			<span
				class={cn(
          "text-center text-sm font-medium text-nowrap",
          getStepStatus(index) === "complete" && "text-primary",
          getStepStatus(index) === "current" && "text-primary",
          getStepStatus(index) === "upcoming" && "text-muted-foreground"
        )}
			>
        {step.name}
      </span>
		</button>

		{#if index < steps.length - 1}
			<div class="flex flex-grow items-center min-w-10 max-w-[250px]">
				<div
					class={cn(
              "flex-grow h-[2px]",
              getStepStatus(index) === "complete" ? "bg-primary" : "bg-muted"
            )}
				>
				</div>
			</div>
		{/if}
	{/each}
</div>