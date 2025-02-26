<script>
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
  import { ChevronDown, ChevronUp, Terminal, AlertCircle, CheckCircle, Clock } from 'lucide-svelte';
  import { cn } from '$lib/utils.js';

  export let stderr = '';
  export let stdout = '';
  export let compilationOutput = '';
  export let statusMessage = '';
  export let collapse;




  let isCollapsed = false;

  // Get status type for styling
  $: statusType = getStatusType(statusMessage);

  // Helper to determine status type
  function getStatusType(status) {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('success') || statusLower.includes('pass')) return 'success';
    if (statusLower.includes('error') || statusLower.includes('fail')) return 'error';
    if (statusLower.includes('pending') || statusLower.includes('running')) return 'pending';
    return 'default';
  }

  // Helper to check if a section has content
  function hasContent(str) {
    return str && str.trim().length > 0;
  }

  // Toggle collapse state
  function toggleCollapse() {
    isCollapsed = !isCollapsed;
    if (collapse) collapse();
  }

  // Count non-empty sections
  $: activeSections = [
    hasContent(stderr),
    hasContent(stdout),
    hasContent(compilationOutput),
    hasContent(statusMessage)
  ].filter(Boolean).length;

  // Default active tab
  $: defaultTab = hasContent(stdout) ? 'stdout' :
    hasContent(compilationOutput) ? 'compilation' :
      hasContent(stderr) ? 'stderr' : 'status';
</script>

<Card.Root class="flex-col flex-grow shrink overflow-hidden flex">
	<Card.Header class="pb-2">
		<div class="flex flex-row items-center justify-between w-full">
			<div class="flex items-center gap-2">
				<Card.Title>Submission Result</Card.Title>
				<Badge
					variant={statusType === 'success' ? 'success' :
                  statusType === 'error' ? 'destructive' :
                  statusType === 'pending' ? 'outline' : 'secondary'}
					class="ml-2"
				>
					<svelte:component
						this={statusType === 'success' ? CheckCircle :
                 statusType === 'error' ? AlertCircle :
                 statusType === 'pending' ? Clock : Terminal}
						class="h-3 w-3 mr-1"
					/>
					{statusMessage}
				</Badge>
			</div>
			{#if collapse}
				<Button
					variant="ghost"
					size="icon"
					on:click={toggleCollapse}
					class="h-8 w-8 p-0"
					aria-label={isCollapsed ? "Expand results" : "Collapse results"}
				>
					<svelte:component this={isCollapsed ? ChevronDown : ChevronUp} class="h-4 w-4" />
				</Button>
			{/if}
		</div>
	</Card.Header>

	{#if !isCollapsed}
		<Separator />

		{#if activeSections > 1}
			<Tabs defaultValue={defaultTab} class="w-full">
				<Card.Content class="pb-0 pt-4">
					<TabsList class="grid" style="grid-template-columns: repeat({activeSections}, minmax(0, 1fr));">
						{#if hasContent(stdout)}
							<TabsTrigger value="stdout">Output</TabsTrigger>
						{/if}
						{#if hasContent(stderr)}
							<TabsTrigger value="stderr">Errors</TabsTrigger>
						{/if}
						{#if hasContent(compilationOutput)}
							<TabsTrigger value="compilation">Compilation</TabsTrigger>
						{/if}
						{#if hasContent(statusMessage)}
							<TabsTrigger value="status">Status</TabsTrigger>
						{/if}
					</TabsList>
				</Card.Content>

				{#if hasContent(stdout)}
					<TabsContent value="stdout" class="m-0 pt-2">
						<Card.Content>
							<div class="relative rounded-md border p-3 bg-muted/50">
								<pre class="result-block"><code>{stdout}</code></pre>
							</div>
						</Card.Content>
					</TabsContent>
				{/if}

				{#if hasContent(stderr)}
					<TabsContent value="stderr" class="m-0 pt-2">
						<Card.Content>
							<div class="relative rounded-md border border-destructive/50 p-3 bg-destructive/10">
								<pre class="result-block"><code>{stderr}</code></pre>
							</div>
						</Card.Content>
					</TabsContent>
				{/if}

				{#if hasContent(compilationOutput)}
					<TabsContent value="compilation" class="m-0 pt-2">
						<Card.Content>
							<div class="relative rounded-md border p-3 bg-muted/50">
								<pre class="result-block"><code>{compilationOutput}</code></pre>
							</div>
						</Card.Content>
					</TabsContent>
				{/if}

				{#if hasContent(statusMessage)}
					<TabsContent value="status" class="m-0 pt-2">
						<Card.Content>
							<div class="relative rounded-md border p-3 bg-muted/50">
								<pre class="result-block"><code>{statusMessage}</code></pre>
							</div>
						</Card.Content>
					</TabsContent>
				{/if}
			</Tabs>
		{:else}
			<!-- Single section display -->
			<Card.Content class="pt-4">
				{#if hasContent(stdout)}
					<div class="relative rounded-md border p-3 bg-muted/50">
						<pre class="result-block"><code>{stdout}</code></pre>
					</div>
				{:else if hasContent(stderr)}
					<div class="relative rounded-md border border-destructive/50 p-3 bg-destructive/10">
						<pre class="result-block"><code>{stderr}</code></pre>
					</div>
				{:else if hasContent(compilationOutput)}
					<div class="relative rounded-md border p-3 bg-muted/50">
						<pre class="result-block"><code>{compilationOutput}</code></pre>
					</div>
				{:else if hasContent(statusMessage)}
					<div class="relative rounded-md border p-3 bg-muted/50">
						<pre class="result-block"><code>{statusMessage}</code></pre>
					</div>
				{/if}
			</Card.Content>
		{/if}
	{/if}
</Card.Root>

<style>
    .result-block {
        margin: 0;
        font-size: 0.875rem;
        max-height: 20rem;
        overflow: auto;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
</style>