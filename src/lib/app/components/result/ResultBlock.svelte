<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import {
		ChevronDown,
		Clock,
		CheckCircle,
		XCircle,
		AlertTriangle,
		Timer,
		FileWarning,
		AlertCircle,
		Bug
	} from 'lucide-svelte';
	import type { ClientState } from '$lib/api/anacode/submission.client.js';
	import { ClientStatus } from '$lib/api/anacode/submission.client.js';
	import type { Writable } from 'svelte/store';
	import SuccessBlock from '$lib/app/components/result/SuccessBlock.svelte';
	import ProcessingBlock from '$lib/app/components/result/ProcessingBlock.svelte';
	import IdleBlock from '$lib/app/components/result/IdleBlock.svelte';
	import TimeoutBlock from '$lib/app/components/result/TimeoutBlock.svelte';
	import ErrorBlock from '$lib/app/components/result/ErrorBlock.svelte';

	export let clientState: Writable<ClientState>;
	clientState.subscribe(
		clientState => {
			console.log('clientState', clientState);
		}
	);
</script>


<div class="flex flex-grow flex-col shrink min-w-[400px] min-h-0">
	{#if $clientState.ClientStatus === ClientStatus.Success}
		<SuccessBlock submissionResult={$clientState.SubmissionResult} />
	{/if}
	{#if $clientState.ClientStatus === ClientStatus.Processing}
		<ProcessingBlock />
	{/if}
	{#if $clientState.ClientStatus === ClientStatus.Idle}
		<IdleBlock />
	{/if}
	{#if $clientState.ClientStatus === ClientStatus.Timeout}
		<TimeoutBlock />
	{/if}
	{#if $clientState.ClientStatus === ClientStatus.Error}
		<ErrorBlock errorMessage={$clientState.ClientMessage} />
	{/if}
</div>


<style>
</style>