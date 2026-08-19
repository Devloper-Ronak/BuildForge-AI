// src/ai/aiRetry.js

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
    const status = error?.status;
    const message = String(error?.message || "").toLowerCase();

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        message.includes("429") ||
        message.includes("rate limit") ||
        message.includes("quota") ||
        message.includes("temporarily unavailable") ||
        message.includes("overloaded") ||
        message.includes("timeout")
    );
};

export const withRetry = async(
    fn,
    retries = 3,
    delay = 1500
) => {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            console.error(
                `⚠️ AI attempt ${attempt}/${retries} failed:`,
                error?.message
            );

            if (!isRetryableError(error)) {
                throw error;
            }

            if (attempt === retries) {
                break;
            }

            const backoff = delay * 2 ** (attempt - 1);

            console.log(
                `⏳ Retrying AI request in ${backoff}ms...`
            );

            await sleep(backoff);
        }
    }

    throw lastError;
};