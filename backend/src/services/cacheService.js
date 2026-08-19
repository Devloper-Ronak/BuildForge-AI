const cache = new Map();

const CACHE_TIME =
    1000 * 60 * 30;

// ==========================================
// GET CACHE
// ==========================================

export const getCache = (
    key
) => {
    const item =
        cache.get(key);

    if (!item) {
        return null;
    }

    if (
        Date.now() >
        item.expiry
    ) {
        cache.delete(key);

        return null;
    }

    return item.value;
};

// ==========================================
// SET CACHE
// ==========================================

export const setCache = (
    key,
    value,
    ttl = CACHE_TIME
) => {
    cache.set(key, {
        value,

        expiry: Date.now() + ttl,
    });

    return value;
};

// ==========================================
// DELETE CACHE
// ==========================================

export const deleteCache = (
    key
) => {
    cache.delete(key);
};

// ==========================================
// CLEAR CACHE
// ==========================================

export const clearCache = () => {
    cache.clear();
};