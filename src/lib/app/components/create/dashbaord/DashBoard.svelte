<script lang="ts">
	/**********************************************
	 *     ICONS & COMPONENT IMPORTS (adjust paths)
	 **********************************************/
	import Activity from 'lucide-svelte/icons/activity';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import CheckCircle from 'lucide-svelte/icons/check-circle';
	import Download from 'lucide-svelte/icons/download';
	import List from 'lucide-svelte/icons/list';
	import Users from 'lucide-svelte/icons/users';
	import TrendingUp from 'lucide-svelte/icons/trending-up';
	import Clock from 'lucide-svelte/icons/clock';
	import BarChart from 'lucide-svelte/icons/bar-chart';
	import Brain from 'lucide-svelte/icons/brain';
	import Filter from 'lucide-svelte/icons/filter';
	import Plus from 'lucide-svelte/icons/plus';

	// The following components come from your shadcn-svelte style library:
	// Adjust the import paths to match your project structure.
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	/**********************************************
	 *               MOCK DATA
	 **********************************************/
		// Your problems
	let problems = [
			{
				id: 'PROB-001',
				title: 'Two Sum',
				difficulty: 'Easy',
				submissions: 423,
				acceptRate: 67,
				avgAttempts: 2.4,
				createdAt: '2025-01-15'
			},
			{
				id: 'PROB-002',
				title: 'Valid Parentheses',
				difficulty: 'Medium',
				submissions: 312,
				acceptRate: 58,
				avgAttempts: 3.2,
				createdAt: '2025-01-28'
			},
			{
				id: 'PROB-003',
				title: 'Merge K Sorted Lists',
				difficulty: 'Hard',
				submissions: 156,
				acceptRate: 42,
				avgAttempts: 4.7,
				createdAt: '2025-02-10'
			},
			{
				id: 'PROB-004',
				title: 'Binary Tree Level Order',
				difficulty: 'Medium',
				submissions: 201,
				acceptRate: 61,
				avgAttempts: 2.9,
				createdAt: '2025-02-18'
			},
			{
				id: 'PROB-005',
				title: 'Word Search',
				difficulty: 'Medium',
				submissions: 178,
				acceptRate: 53,
				avgAttempts: 3.5,
				createdAt: '2025-02-22'
			}
		];

	// Selected problem for detailed view (default to first problem)
	let selectedProblem = problems[0];

	// Top metrics
	let stats = {
		totalSubmissions: problems.reduce((sum, p) => sum + p.submissions, 0),
		avgSuccessRate: Math.round(problems.reduce((sum, p) => sum + p.acceptRate, 0) / problems.length),
		uniqueUsers: 345,
		commonStatusError: 'Time Limit Exceeded'
	};

	// Performance data for selected problem
	let performance = {
		avgRuntime: 135,  // ms
		avgMemory: 278,   // MB
		runtimeDistribution: [5, 12, 25, 35, 45, 38, 24, 13, 8, 3],
		memoryDistribution: [8, 15, 28, 42, 38, 30, 22, 12, 5, 2]
	};

	// Recent submissions for selected problem
	let submissions = [
		{
			id: 'SUB-1423',
			user: 'Alice',
			result: 'Accepted',
			runtime: 95,
			memory: 180,
			language: 'Python',
			date: '2025-02-25 10:12'
		},
		{
			id: 'SUB-1422',
			user: 'Bob',
			result: 'Wrong Answer',
			runtime: 120,
			memory: 250,
			language: 'JavaScript',
			date: '2025-02-25 09:50'
		},
		{
			id: 'SUB-1421',
			user: 'Charlie',
			result: 'TLE',
			runtime: 180,
			memory: 300,
			language: 'Java',
			date: '2025-02-25 09:48'
		},
		{
			id: 'SUB-1420',
			user: 'Dana',
			result: 'Accepted',
			runtime: 100,
			memory: 200,
			language: 'C++',
			date: '2025-02-25 09:45'
		},
		{
			id: 'SUB-1419',
			user: 'Elijah',
			result: 'Runtime Error',
			runtime: 88,
			memory: 190,
			language: 'Go',
			date: '2025-02-25 09:30'
		}
	];

	// Language distribution for selected problem
	let languageDistribution = [
		{ language: 'Python', count: 150, percentage: 35 },
		{ language: 'JavaScript', count: 120, percentage: 28 },
		{ language: 'Java', count: 80, percentage: 19 },
		{ language: 'C++', count: 50, percentage: 12 },
		{ language: 'Go', count: 23, percentage: 6 }
	];

	// User feedback for the selected problem
	let feedback = [
		{ user: 'Alex', rating: 5, comment: 'Great problem! Perfect difficulty for practicing binary trees.' },
		{ user: 'Jamie', rating: 4, comment: 'Nice challenge, though the example could be clearer.' },
		{ user: 'Taylor', rating: 5, comment: 'Loved solving this one! Great test of algorithm knowledge.' }
	];

	// Function to handle problem selection
	function selectProblem(problem) {
		selectedProblem = problem;
		// In a real app, you would fetch the detailed data for this problem
	}
</script>

<!-- Main dashboard layout for md+ -->
<div class="flex flex-col">
	<!-- Top navigation bar -->
	<div class="border-b">
		<div class="flex h-16 items-center px-4">
			<h1 class="text-xl font-bold">Problem Creator Dashboard</h1>
			<div class="ml-auto flex items-center space-x-4">
				<Button variant="outline" size="sm">
					<Filter class="mr-2 h-4 w-4" />
					Filter
				</Button>
				<Button size="sm">
					<Plus class="mr-2 h-4 w-4" />
					Create Problem
				</Button>
			</div>
		</div>
	</div>

	<!-- Dashboard main content -->
	<div class="flex-1 space-y-4 p-8 pt-6">
		<!-- Problem selection section -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Your Problems</Card.Title>
				<Card.Description>
					Select a problem to view detailed statistics
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
						<tr class="border-b text-sm">
							<th class="text-left py-3 font-medium">Problem</th>
							<th class="text-left py-3 font-medium">Difficulty</th>
							<th class="text-center py-3 font-medium">Submissions</th>
							<th class="text-center py-3 font-medium">Accept Rate</th>
							<th class="text-center py-3 font-medium">Avg. Attempts</th>
							<th class="text-left py-3 font-medium">Created</th>
							<th class="text-center py-3 font-medium">Action</th>
						</tr>
						</thead>
						<tbody>
						{#each problems as problem}
							<tr class="border-b hover:bg-muted/50 cursor-pointer" class:bg-muted={selectedProblem.id === problem.id}
									on:click={() => selectProblem(problem)}>
								<td class="py-3">{problem.title}</td>
								<td class="py-3">
										<span class="px-2 py-1 rounded text-xs font-medium"
													class:bg-green-100={problem.difficulty === 'Easy'}
													class:text-green-700={problem.difficulty === 'Easy'}
													class:bg-yellow-100={problem.difficulty === 'Medium'}
													class:text-yellow-700={problem.difficulty === 'Medium'}
													class:bg-red-100={problem.difficulty === 'Hard'}
													class:text-red-700={problem.difficulty === 'Hard'}>
											{problem.difficulty}
										</span>
								</td>
								<td class="py-3 text-center">{problem.submissions}</td>
								<td class="py-3 text-center">{problem.acceptRate}%</td>
								<td class="py-3 text-center">{problem.avgAttempts}</td>
								<td class="py-3">{problem.createdAt}</td>
								<td class="py-3 text-center">
									<Button variant="ghost" size="sm">Edit</Button>
								</td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Problem Statistics Dashboard -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-2xl font-bold">{selectedProblem.title} Statistics</h2>
				<div class="flex items-center space-x-2">
					<Button variant="outline" size="sm">
						<Download class="mr-2 h-4 w-4" />
						Export Data
					</Button>
				</div>
			</div>

			<Tabs.Root value="overview" class="space-y-4">
				<Tabs.List>
					<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
					<Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
					<Tabs.Trigger value="feedback">User Feedback</Tabs.Trigger>
					<Tabs.Trigger value="settings">Problem Settings</Tabs.Trigger>
				</Tabs.List>

				<!-- OVERVIEW tab content -->
				<Tabs.Content value="overview" class="space-y-4">
					<!-- 4 Stats Cards Row -->
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<!-- Total Submissions -->
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Submissions</Card.Title>
								<List class="text-muted-foreground h-4 w-4" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">{selectedProblem.submissions}</div>
								<p class="text-muted-foreground text-xs">
									+23 in the last 24 hours
								</p>
							</Card.Content>
						</Card.Root>

						<!-- Success Rate -->
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Accept Rate</Card.Title>
								<CheckCircle class="text-muted-foreground h-4 w-4" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">{selectedProblem.acceptRate}%</div>
								<p class="text-muted-foreground text-xs">
									{selectedProblem.acceptRate > 60 ? 'Good' : selectedProblem.acceptRate > 40 ? 'Average' : 'Challenging'}
									difficulty balance
								</p>
							</Card.Content>
						</Card.Root>

						<!-- Average Attempts -->
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Avg. Attempts</Card.Title>
								<TrendingUp class="text-muted-foreground h-4 w-4" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">{selectedProblem.avgAttempts}</div>
								<p class="text-muted-foreground text-xs">
									Per successful solution
								</p>
							</Card.Content>
						</Card.Root>

						<!-- Most Common Error -->
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Common Error</Card.Title>
								<AlertTriangle class="text-muted-foreground h-4 w-4" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">{stats.commonStatusError}</div>
								<p class="text-muted-foreground text-xs">
									In 42% of failures
								</p>
							</Card.Content>
						</Card.Root>
					</div>

					<!-- Performance & Language Distribution Row -->
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<!-- Left: Performance Metrics (col-span-4) -->
						<Card.Root class="col-span-4">
							<Card.Header>
								<Card.Title>Performance Metrics</Card.Title>
								<Card.Description>
									Runtime and memory usage distribution
								</Card.Description>
							</Card.Header>
							<Card.Content>
								<!-- Show average runtime & memory usage -->
								<div class="grid grid-cols-2 gap-4 mb-4">
									<div>
										<p class="text-sm text-muted-foreground">Avg Runtime</p>
										<p class="text-xl font-semibold">{performance.avgRuntime} ms</p>
									</div>
									<div>
										<p class="text-sm text-muted-foreground">Avg Memory</p>
										<p class="text-xl font-semibold">{performance.avgMemory} MB</p>
									</div>
								</div>

								<!-- Runtime distribution visualization -->
								<div class="mt-6">
									<p class="text-sm font-medium mb-2">Runtime Distribution</p>
									<div class="flex items-end h-24 gap-1">
										{#each performance.runtimeDistribution as count, i}
											<div
												class="bg-blue-500 rounded-t w-full"
												style="height: {count * 2}px"
											>
												<span class="sr-only">{count} submissions</span>
											</div>
										{/each}
									</div>
									<div class="flex justify-between mt-1 text-xs text-muted-foreground">
										<span>Fast</span>
										<span>Runtime (ms)</span>
										<span>Slow</span>
									</div>
								</div>

								<!-- Memory distribution visualization -->
								<div class="mt-6">
									<p class="text-sm font-medium mb-2">Memory Usage Distribution</p>
									<div class="flex items-end h-24 gap-1">
										{#each performance.memoryDistribution as count, i}
											<div
												class="bg-green-500 rounded-t w-full"
												style="height: {count * 2}px"
											>
												<span class="sr-only">{count} submissions</span>
											</div>
										{/each}
									</div>
									<div class="flex justify-between mt-1 text-xs text-muted-foreground">
										<span>Low</span>
										<span>Memory Usage (MB)</span>
										<span>High</span>
									</div>
								</div>
							</Card.Content>
						</Card.Root>

						<!-- Right: Language Usage (col-span-3) -->
						<Card.Root class="col-span-3">
							<Card.Header>
								<Card.Title>Programming Languages</Card.Title>
								<Card.Description>
									Distribution by language
								</Card.Description>
							</Card.Header>
							<Card.Content>
								<div class="space-y-4">
									{#each languageDistribution as lang}
										<div>
											<div class="flex justify-between mb-1">
												<span class="text-sm font-medium">{lang.language}</span>
												<span class="text-sm text-muted-foreground">{lang.count} ({lang.percentage}%)</span>
											</div>
											<div class="w-full bg-muted rounded-full h-2">
												<div class="bg-primary rounded-full h-2" style="width: {lang.percentage}%"></div>
											</div>
										</div>
									{/each}
								</div>

								<div class="mt-6">
									<p class="text-sm font-medium mb-2">Success Rate by Language</p>
									<table class="w-full text-sm">
										<thead class="text-xs uppercase text-muted-foreground">
										<tr>
											<th class="py-2 text-left">Language</th>
											<th class="py-2 text-right">Success</th>
											<th class="py-2 text-right">Avg Runtime</th>
										</tr>
										</thead>
										<tbody>
										<tr class="border-b">
											<td class="py-2">Python</td>
											<td class="py-2 text-right">72%</td>
											<td class="py-2 text-right">125ms</td>
										</tr>
										<tr class="border-b">
											<td class="py-2">JavaScript</td>
											<td class="py-2 text-right">65%</td>
											<td class="py-2 text-right">140ms</td>
										</tr>
										<tr class="border-b">
											<td class="py-2">Java</td>
											<td class="py-2 text-right">58%</td>
											<td class="py-2 text-right">110ms</td>
										</tr>
										</tbody>
									</table>
								</div>
							</Card.Content>
						</Card.Root>
					</div>

					<!-- Recent Activity -->
					<Card.Root>
						<Card.Header>
							<Card.Title>Recent Submissions</Card.Title>
							<Card.Description>
								Latest activity for this problem
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<table class="w-full text-sm">
								<thead class="text-xs uppercase text-muted-foreground">
								<tr>
									<th class="py-2 text-left">ID</th>
									<th class="py-2 text-left">User</th>
									<th class="py-2 text-left">Result</th>
									<th class="py-2 text-left">Runtime</th>
									<th class="py-2 text-left">Memory</th>
									<th class="py-2 text-left">Language</th>
									<th class="py-2 text-left">Date</th>
								</tr>
								</thead>
								<tbody>
								{#each submissions as sub}
									<tr class="border-b last:border-b-0">
										<td class="py-2">{sub.id}</td>
										<td class="py-2">{sub.user}</td>
										<td class="py-2">
												<span class="px-2 py-1 rounded text-xs font-medium"
															class:bg-green-100={sub.result === 'Accepted'}
															class:text-green-700={sub.result === 'Accepted'}
															class:bg-red-100={sub.result === 'Wrong Answer' || sub.result === 'Runtime Error'}
															class:text-red-700={sub.result === 'Wrong Answer' || sub.result === 'Runtime Error'}
															class:bg-yellow-100={sub.result === 'TLE'}
															class:text-yellow-700={sub.result === 'TLE'}>
													{sub.result}
												</span>
										</td>
										<td class="py-2">{sub.runtime} ms</td>
										<td class="py-2">{sub.memory} MB</td>
										<td class="py-2">{sub.language}</td>
										<td class="py-2">{sub.date}</td>
									</tr>
								{/each}
								</tbody>
							</table>
							<div class="mt-4 flex justify-end">
								<Button variant="outline" size="sm">View All Submissions</Button>
							</div>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>

				<!-- SUBMISSIONS tab content -->
				<Tabs.Content value="submissions" class="space-y-4">
					<Card.Root>
						<Card.Header>
							<Card.Title>Submission Analysis</Card.Title>
							<Card.Description>
								Detailed breakdown of submissions over time
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="text-center py-8 text-muted-foreground">
								Submission analysis charts and filters would be displayed here
							</div>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>

				<!-- USER FEEDBACK tab content -->
				<Tabs.Content value="feedback" class="space-y-4">
					<Card.Root>
						<Card.Header>
							<Card.Title>User Feedback</Card.Title>
							<Card.Description>
								Ratings and comments from users
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-2 mb-6">
								<div>
									<h3 class="text-2xl font-bold">4.7</h3>
									<p class="text-muted-foreground">Average Rating</p>
								</div>
								<div>
									<div class="flex items-center">
										<span class="text-sm text-muted-foreground mr-2">5★</span>
										<div class="w-full bg-muted rounded-full h-2 mr-2">
											<div class="bg-primary rounded-full h-2" style="width: 70%"></div>
										</div>
										<span class="text-sm text-muted-foreground">70%</span>
									</div>
									<div class="flex items-center">
										<span class="text-sm text-muted-foreground mr-2">4★</span>
										<div class="w-full bg-muted rounded-full h-2 mr-2">
											<div class="bg-primary rounded-full h-2" style="width: 20%"></div>
										</div>
										<span class="text-sm text-muted-foreground">20%</span>
									</div>
									<div class="flex items-center">
										<span class="text-sm text-muted-foreground mr-2">3★</span>
										<div class="w-full bg-muted rounded-full h-2 mr-2">
											<div class="bg-primary rounded-full h-2" style="width: 8%"></div>
										</div>
										<span class="text-sm text-muted-foreground">8%</span>
									</div>
									<div class="flex items-center">
										<span class="text-sm text-muted-foreground mr-2">2★</span>
										<div class="w-full bg-muted rounded-full h-2 mr-2">
											<div class="bg-primary rounded-full h-2" style="width: 2%"></div>
										</div>
										<span class="text-sm text-muted-foreground">2%</span>
									</div>
									<div class="flex items-center">
										<span class="text-sm text-muted-foreground mr-2">1★</span>
										<div class="w-full bg-muted rounded-full h-2 mr-2">
											<div class="bg-primary rounded-full h-2" style="width: 0%"></div>
										</div>
										<span class="text-sm text-muted-foreground">0%</span>
									</div>
								</div>
							</div>

							<h3 class="font-medium mb-4">Latest Comments</h3>
							<div class="space-y-4">
								{#each feedback as item}
									<div class="border-b pb-4 last:border-b-0">
										<div class="flex justify-between">
											<span class="font-medium">{item.user}</span>
											<span class="text-muted-foreground">{item.rating} ★</span>
										</div>
										<p class="mt-1">{item.comment}</p>
									</div>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>

				<!-- PROBLEM SETTINGS tab content -->
				<Tabs.Content value="settings" class="space-y-4">
					<Card.Root>
						<Card.Header>
							<Card.Title>Problem Settings</Card.Title>
							<Card.Description>
								Manage settings for this problem
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="text-center py-8 text-muted-foreground">
								Problem settings would be displayed here
							</div>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>