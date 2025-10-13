const exclusionTerms = ['"stable diffusion"', "ai", "midjourney", "freepik", "lexica"];

function modifySearch(details) {
    const url = new URL(details.url);
    let queryParam = null;

    if (url.hostname.includes("google.com")) {
        queryParam = "q";
    } else if (url.hostname.includes("bing.com")) {
        queryParam = "q";
    } else if (url.hostname.includes("duckduckgo.com")) {
        queryParam = "q";
    }

    if (!queryParam) return;

    const originalQuery = url.searchParams.get(queryParam);
    if (!originalQuery) return;

    let trimmedQuery = originalQuery.trim();

    if (!trimmedQuery.includes("!ai")) {
        return;
    }

    trimmedQuery = trimmedQuery.replace(/!ai\b/, "").trim();

    const exclusions = exclusionTerms
    .filter(term => !trimmedQuery.includes(`-${term}`))
    .map(term => `-${term}`)
    .join(" ");

    const modifiedQuery = `${trimmedQuery} ${exclusions}`.trim();
    url.searchParams.set(queryParam, modifiedQuery);

    const newUrl = url.toString();
    if (newUrl !== details.url) {
        return { redirectUrl: newUrl };
    }
}

browser.webRequest.onBeforeRequest.addListener(
    modifySearch,
    {
        urls: [
            "*://www.google.com/search*",
            "*://www.bing.com/search*",
            "*://duckduckgo.com/*"
        ]
    },
    ["blocking"]
);
