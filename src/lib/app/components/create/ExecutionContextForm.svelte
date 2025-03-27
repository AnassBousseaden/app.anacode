<script>
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Collapsible from '$lib/components/ui/collapsible/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { ChevronsUpDown } from 'lucide-svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Label } from '$lib/components/ui/label/index.js';


  export let form;
  export let languageInfo;

  const { form: formData, enhance } = form;

</script>

<Card.Root class="flex-1 flex flex-col min-h-0 max-w-[100%]">
	<Card.Header>
		<Card.Title>Execution Context Configuration</Card.Title>
		<Card.Description>
			Specify behaviour for the execution context
		</Card.Description>
	</Card.Header>

	<form method="POST" use:enhance={enhance} class="flex-1 flex flex-col min-h-0">
		<Card.Content class="space-y-3 min-h-0 overflow-auto flex-1">
			<Separator />
			{@render languageInfoCollapsable(languageInfo)}
			<Separator />

			<Card.Root>
				<Card.Header>
					{@render cardTitleWithButton("Compiler Options", "Specify compiler options")}
				</Card.Header>
				<Card.Content class="space-y-2">
					<Form.Field {form} name="compiler_options">
						<Form.Control let:attrs>
							<Input
								id="compiler_options"
								{...attrs}
								bind:value={$formData.compiler_options}
								placeholder="eg -O2"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<div>
						<pre class="mb-1">Compile command:</pre>
						<code class="block  bg-secondary text-secondary-foreground p-3 rounded-lg">
							{#if languageInfo?.compile_cmd.includes('%s')}
								{languageInfo.compile_cmd.split('%s')[0]}
								{#if $formData.compiler_options?.trim().length > 0}
										<span
											class="px-1 italic rounded-md text-secondary bg-secondary-foreground break-words">
											{$formData.compiler_options.trim()}
										</span>
								{/if}
								{languageInfo.compile_cmd.split('%s')[1]}
							{/if}
						</code>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					{@render cardTitleWithButton("Wall Time Limit", "Specify time limit for an execution")}
				</Card.Header>
				<Card.Content class="space-y-2">
					<Form.Field {form} name="wall_time_limit">
						<Form.Control let:attrs>
							<Input
								type="number"
								id="wall_time_limit"
								{...attrs}
								bind:value={$formData.wall_time_limit}
								step="0.1"
								placeholder="2.0"
								min="1"
								max="5"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					{@render cardTitleWithButton("Enable Network", "Allow network calls during program execution")}
				</Card.Header>
				<Card.Content class="space-y-2">
					<Form.Field {form} name="enable_network">
						<Form.Control let:attrs>
							<div class="flex items-center space-x-2">
								<Switch
									id="enable_network"
									{...attrs}
									bind:checked={$formData.enable_network}
								/>
								<Label for="enable_network">
									{$formData.enable_network ? 'Enabled' : 'Disabled'}
								</Label>
							</div>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>
		</Card.Content>

	</form>
</Card.Root>

{#snippet cardTitleWithButton(title, description)}
	<Card.Title>{title}</Card.Title>
	<Card.Description>{description}</Card.Description>
{/snippet}

{#snippet f(header, content)}
	{#if content}
		<div>
			<pre class="mb-1">{header}:</pre>
			<code class="block bg-secondary text-secondary-foreground p-3 rounded-lg">
				{content}
			</code>
		</div>
	{/if}
{/snippet}

{#snippet languageInfoCollapsable(languageInfo)}
	<Collapsible.Root class="space-y-3">
		<div class="flex items-center justify-between rounded-md border px-6 py-2">
			<h4 class="text-sm font-semibold">{languageInfo?.name}</h4>
			<Collapsible.Trigger asChild let:builder>
				<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
					<ChevronsUpDown class="h-4 w-4" />
					<span class="sr-only">Toggle</span>
				</Button>
			</Collapsible.Trigger>
		</div>
		<Collapsible.Content class="space-y-2">
			<Card.Root>
				<Card.Content>
					<div class="space-y-4">
						{@render f("Compile command", languageInfo?.compile_cmd.replace('%s', ''))}
						{@render f("Run command", languageInfo?.run_cmd) }
						{@render f("Main source file", languageInfo?.source_file) }
						{@render f("Solution source file", languageInfo?.solution_file) }
					</div>
				</Card.Content>
			</Card.Root>
		</Collapsible.Content>
	</Collapsible.Root>
{/snippet}