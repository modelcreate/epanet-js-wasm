import { benchmarkNodeIndexCalls, benchmarkNodeIndexCallsEpanetJs } from './benchmarks/calls-per-second.js';

// Use it in an async function
async function runBenchmark() {
    try {
        const results = await benchmarkNodeIndexCalls(60_000_000);
        console.log(`Performance: ${results.millionRunsPerSecond.toFixed(4)} million calls per second`);

        const resultsEpanetJs = await benchmarkNodeIndexCallsEpanetJs(60_000_000);
        console.log(`Performance: ${resultsEpanetJs.millionRunsPerSecond.toFixed(4)} million calls per second`);
    } catch (error) {
        console.error('Benchmark failed:', error.message);
    }
}

runBenchmark();