# Peak Hours

A static site to check whether AI providers are currently in peak billing hours — because timezones are too hard.

## Features

- **Multi-provider tracking**: Z.ai, DeepSeek, Qwen, MiniMax, Kimi, OpenAI, Anthropic, Google Gemini, xAI, opencode (Zen + Go), Mistral
- **Provider picker**: select which providers to track; the choice persists in `localStorage`
- **Live status**: peak / off-peak state, local time at the provider, and a countdown to the next rate switch
- **Dark mode**: follows the OS preference initially, toggleable, persisted in `localStorage`
- **Neumorphic design**: soft-extruded light and dark themes, no dependencies

## The framework

`peak-hours.js` is a tiny dependency-free library for defining and evaluating time-based billing windows:

- `PeakHours.register(definition)` — define a provider: `id`, `name`, IANA `timezone`, peak `windows` (`{days: [0–6], start: "HH:MM", end: "HH:MM"}`, may wrap midnight), `peak`/`offPeak` rate labels, `note`, and `source`. Providers with flat pricing set `flat: true` and omit windows.
- `PeakHours.evaluate(provider, date?)` — returns `{ peak, wall, nextTransition, secondsUntilTransition }`
- `PeakHours.isPeak(provider, date?)`, `PeakHours.describeSchedule(provider)`, `PeakHours.formatDelta(seconds)`

Provider definitions live in `providers.js` (verified against official docs, September 2026).

## Peak windows at a glance

| Provider | Peak window | What changes |
|---|---|---|
| Z.ai (GLM Coding Plan) | Mon–Fri 14:00–18:00 Singapore (UTC+8) | Off-peak: 0.5× credit rate |
| DeepSeek | Mon–Fri 01:00–04:00 & 06:00–10:00 UTC (excl. CN holidays) | Off-peak: half price |
| opencode Go | Mon–Fri 01:00–04:00 & 06:00–10:00 UTC (DeepSeek models only) | Off-peak: half price |
| Qwen (Alibaba Model Studio) | Daily 08:00–22:00 Beijing (night = 22:00–08:00) | Night: 60% off, day: 20% off (limited-time) |
| MiniMax | Weekdays ~15:00–17:30 (load-adjusted) | Rate limiting only, not price |
| Anthropic (Claude) | — (peak reductions removed May 2026) | Flat |
| Everyone else | Flat pricing | — |

Windows verified against official docs with quotes, September 28 2026. See each card's source link in the app.

## Run

Static files only — open `index.html`, or serve the folder:

```
python -m http.server
```
