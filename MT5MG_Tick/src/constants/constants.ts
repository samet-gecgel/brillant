
export const exchangeSymbols = new Map([
    ["EUR", { symbol: "EURUSD", reverse: false }],
    ["TRY", { symbol: "USDTRY", reverse: true }],
    ["GBP", { symbol: "GBPUSD", reverse: false }],
    ["JPY", { symbol: "USDJPY", reverse: true }],
    ["AUD", { symbol: "AUDUSD", reverse: false }],
    ["CAD", { symbol: "USDCAD", reverse: true }],
    ["CHF", { symbol: "USDCHF", reverse: true }],
    ["ZAR", { symbol: "USDZAR", reverse: true }],
    ["NZD", { symbol: "NZDUSD", reverse: false }],
    ["HUF", { symbol: "USDHUF", reverse: true }],
    ["PLN", { symbol: "USDPLN", reverse: true }],
    ["CZK", { symbol: "USDCZK", reverse: true }],
    ["NOK", { symbol: "USDNOK", reverse: true }],
    ["SEK", { symbol: "USDSEK", reverse: true }],
    ["MXN", { symbol: "USDMXN", reverse: true }],
    ["RUB", { symbol: "USDRUB", reverse: true }],
    ["INR", { symbol: "USDINR", reverse: true }],
]);

export const retCodeToEventMap = new Map([
    ["Position Created", "position-set"]
]);