/**
 * Provider peak-hour definitions.
 * Windows are PEAK windows expressed in the provider's timezone.
 * Verified against official docs as of September 2026.
 */
PeakHours.register({
  id: 'zai',
  name: 'Z.ai (GLM)',
  timezone: 'Asia/Singapore',
  flat: false,
  windows: [{ days: [1, 2, 3, 4, 5], start: '14:00', end: '18:00' }],
  peak: { rate: '1× credits', label: 'Peak — standard credit rate' },
  offPeak: { rate: '0.5× credits', label: 'Off-peak — 50% credit discount' },
  note: 'Drains the Coding Plan credit allowance. Official docs: "During off-peak hours, model usage is charged at 50% of the standard credit rate." Promo (Sep 25–Oct 7, 2026): all-day off-peak rate.',
  source: 'https://docs.z.ai/devpack/overview',
});

PeakHours.register({
  id: 'deepseek',
  name: 'DeepSeek',
  timezone: 'UTC',
  flat: false,
  windows: [
    { days: [1, 2, 3, 4, 5], start: '01:00', end: '04:00' },
    { days: [1, 2, 3, 4, 5], start: '06:00', end: '10:00' },
  ],
  peak: { rate: '1× (standard)', label: 'Peak pricing in effect' },
  offPeak: { rate: '0.5× (half price)', label: 'Off-peak — half price' },
  note: 'Excludes Chinese public holidays; weekends and holidays are entirely off-peak.',
  source: 'https://api-docs.deepseek.com/quick_start/pricing',
});

PeakHours.register({
  id: 'qwen',
  name: 'Qwen (Alibaba)',
  timezone: 'Asia/Shanghai',
  flat: false,
  windows: [{ days: [0, 1, 2, 3, 4, 5, 6], start: '08:00', end: '22:00' }],
  peak: { rate: '0.8× (daytime)', label: 'Daytime — 20% off list (limited-time)' },
  offPeak: { rate: '0.4× (night)', label: 'Night hours — 60% off' },
  note: 'Night hours are 22:00–08:00 Beijing time, billed automatically. Current qwen3.7-plus international pricing: 60% off at night, 20% off daytime (limited-time promo).',
  source: 'https://www.alibabacloud.com/help/en/model-studio/model-pricing',
});

PeakHours.register({
  id: 'minimax',
  name: 'MiniMax',
  timezone: 'Asia/Shanghai',
  flat: false,
  windows: [{ days: [1, 2, 3, 4, 5], start: '15:00', end: '17:30' }],
  peak: { rate: 'Congested', label: 'Peak traffic — possible throttling' },
  offPeak: { rate: 'Normal', label: 'Normal traffic conditions' },
  note: 'Peak traffic hours (typically weekdays 15:00–17:30, timezone not officially specified) trigger dynamic rate limiting — reduced agent capacity and RPM/TPM, not price changes.',
  source: 'https://platform.minimax.io',
});

PeakHours.register({
  id: 'kimi',
  name: 'Kimi (Moonshot)',
  timezone: 'Asia/Shanghai',
  flat: true,
  peak: { rate: 'Flat', label: 'Flat pricing' },
  offPeak: { rate: 'Flat', label: 'Flat pricing' },
  note: 'No time-based pricing. Cache pricing differs by TTL (5-min vs 1-hour cache writes).',
  source: 'https://platform.kimi.ai/docs/pricing/chat',
});

PeakHours.register({
  id: 'openai',
  name: 'OpenAI',
  timezone: 'UTC',
  flat: true,
  peak: { rate: 'Flat', label: 'Flat pricing' },
  offPeak: { rate: 'Flat', label: 'Flat pricing' },
  note: 'No time-of-day pricing. Batch API offers 50% off with a 24-hour window; Priority tier adds capacity guarantees.',
  source: 'https://platform.openai.com/docs/pricing',
});

PeakHours.register({
  id: 'anthropic',
  name: 'Anthropic (Claude)',
  timezone: 'America/Los_Angeles',
  flat: true,
  peak: { rate: 'Flat', label: 'Flat pricing' },
  offPeak: { rate: 'Flat', label: 'Flat pricing' },
  note: 'Peak-hour limit reductions for Claude Code (5-hour session drained faster at peak, reported 5–11 AM PT) were officially removed May 6, 2026. Current limits are time-independent.',
  source: 'https://www.anthropic.com/news/higher-limits-spacex',
});

PeakHours.register({
  id: 'google',
  name: 'Google Gemini',
  timezone: 'UTC',
  flat: true,
  peak: { rate: 'Flat', label: 'Flat pricing' },
  offPeak: { rate: 'Flat', label: 'Flat pricing' },
  note: 'Flat per-token pricing. Batch Mode gives 50% off with up to 24-hour completion.',
  source: 'https://ai.google.dev/gemini-api/docs/batch-mode',
});

PeakHours.register({
  id: 'xai',
  name: 'xAI (Grok)',
  timezone: 'UTC',
  flat: true,
  peak: { rate: 'Flat', label: 'Flat pricing' },
  offPeak: { rate: 'Flat', label: 'Flat pricing' },
  note: 'Flat per-token pricing with spend-based rate-limit tiers.',
  source: 'https://docs.x.ai',
});

PeakHours.register({
  id: 'opencode',
  name: 'opencode (Zen)',
  timezone: 'UTC',
  flat: true,
  peak: { rate: 'Flat', label: 'Flat pricing' },
  offPeak: { rate: 'Flat', label: 'Flat pricing' },
  note: 'Pay-per-token sold at cost — no peak/off-peak rates in the live docs, marketing pages, blog, or any archived version of the Zen docs. (Subscription plan "Go" is tracked separately.)',
  source: 'https://opencode.ai/docs/zen/',
});

PeakHours.register({
  id: 'opencode-go',
  name: 'opencode (Go)',
  timezone: 'UTC',
  flat: false,
  windows: [
    { days: [1, 2, 3, 4, 5], start: '01:00', end: '04:00' },
    { days: [1, 2, 3, 4, 5], start: '06:00', end: '10:00' },
  ],
  peak: { rate: '1× (peak)', label: 'Peak rates on DeepSeek models' },
  offPeak: { rate: '0.5× (half price)', label: 'Off-peak — half price on DeepSeek models' },
  note: 'Applies to DeepSeek V4.1 Flash / V4 Pro / V4 Flash / V4 Flash Vision Exp on the Go and Go Plus plans — same windows as DeepSeek direct. Other Go models bill flat monthly-dollar limits.',
  source: 'https://opencode.ai/docs/go/',
});

PeakHours.register({
  id: 'mistral',
  name: 'Mistral',
  timezone: 'UTC',
  flat: true,
  peak: { rate: 'Flat', label: 'Flat pricing' },
  offPeak: { rate: 'Flat', label: 'Flat pricing' },
  note: 'Flat per-token pricing; Batch API is 50% off (mode-based, not time-based). Viral "peak ≈ 2× off-peak" claims copied DeepSeek\'s pricing text verbatim — a misattribution.',
  source: 'https://mistral.ai/pricing',
});
