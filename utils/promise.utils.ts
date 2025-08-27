export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getHoldTime = (attempt: number) =>
    Math.min(15000, 500 * 2 ** attempt) + Math.random() * 300;

export const withRetry = async <T>(
    fn: () => Promise<T>,
    label: string,
    max: number = 3,
): Promise<T> => {
    let lastError: unknown;

    for (let trial = 0; trial < max; trial++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (trial === max) break;
            const wait = getHoldTime(trial);
            console.warn(
                `[retry] ${label} failed (attempt ${trial + 1}/${max}). Waiting ${wait}ms`,
            );
            await sleep(wait);
        }
    }

    throw lastError;
};
