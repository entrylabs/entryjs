export class Scheduler {
    /**
     * Runs a generator function concurrently
     * It's a naive implementation that uses setTimeout().
     * @param {() => Generator} callback Generator function to schedule
     */
    run(callback) {
        this.cancel();

        // get generator by calling generator function
        const generator = callback();

        const runGenerator = () => {
            // 10ms budget for running task
            const deadline = performance.now() + 10;
            // start iteration
            while (true) {
                // we get result object for each yield and return
                const result = generator.next();
                if (result.done) {
                    // we reached return - no more work to do
                    break;
                } else if (performance.now() >= deadline) {
                    // we reached deadline - now it's time to schedule the next task
                    // and stop the current one
                    this.timeoutId = setTimeout(runGenerator);
                    break;
                }
            }
        };
        // start the generator iteration task
        runGenerator();
    }

    /**
     * Cancels currently running generator.
     */
    cancel() {
        if (this.timeoutId !== undefined) {
            // cancel scheduled task
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }
    }
}
