/**
 * PeakHours — a tiny framework for describing and evaluating
 * time-of-day peak / off-peak billing windows for AI providers.
 *
 * A provider schedule is defined in a single IANA timezone as a set of
 * PEAK windows. Everything outside the peak windows is off-peak.
 * Providers with no time-based pricing simply omit `windows` (flat).
 *
 * Standardized provider definition:
 * {
 *   id:        string  — stable identifier
 *   name:      string  — display name
 *   timezone:  string  — IANA timezone the schedule is expressed in
 *   flat:      boolean — true if pricing does not vary by time of day
 *   windows:  [{ days: [0-6], start: "HH:MM", end: "HH:MM" }]  (peak windows; may wrap midnight)
 *   peak:      { rate: string, label: string }   — what peak means
 *   offPeak:   { rate: string, label: string }   — what off-peak means
 *   note:      string — caveats (holidays, load adjustments, alternatives)
 *   source:    url — official documentation
 * }
 */
const PeakHours = (() => {
  const providers = new Map();

  const parseHM = (s) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };

  function register(provider) {
    if (!provider.id || !provider.timezone) {
      throw new Error('Provider requires id and timezone');
    }
    provider.windows = provider.windows || [];
    providers.set(provider.id, provider);
    return provider;
  }

  const all = () => [...providers.values()];
  const get = (id) => providers.get(id);

  /** Wall-clock fields of `date` rendered in `timeZone`. */
  function wallTime(timeZone, date) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      weekday: 'short',
    }).formatToParts(date);
    const get = (t) => parts.find((p) => p.type === t).value;
    const dayIdx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    let hour = Number(get('hour'));
    if (hour === 24) hour = 0;
    return {
      year: Number(get('year')),
      month: Number(get('month')),
      day: Number(get('day')),
      weekday: dayIdx[get('weekday')],
      hour, minute: Number(get('minute')), second: Number(get('second')),
      minutes: hour * 60 + Number(get('minute')),
    };
  }

  /** Milliseconds to add to a UTC instant to get wall time in `timeZone`. */
  function tzOffsetMs(timeZone, date) {
    const w = wallTime(timeZone, date);
    const asUTC = Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second);
    return asUTC - Math.floor(date.getTime() / 1000) * 1000;
  }

  /** Convert a wall-clock moment (dayOffset days from `ref`'s wall date) to a UTC instant. */
  function fromWall(timeZone, ref, dayOffset, hour, minute) {
    const w = wallTime(timeZone, ref);
    const offset = tzOffsetMs(timeZone, ref);
    return new Date(Date.UTC(w.year, w.month - 1, w.day + dayOffset, hour, minute) - offset);
  }

  function inWindow(minutes, startMin, endMin) {
    if (startMin <= endMin) return minutes >= startMin && minutes < endMin;
    return minutes >= startMin || minutes < endMin; // wraps midnight
  }

  /** Is `date` inside a peak window for `provider`? */
  function isPeak(provider, date) {
    const w = wallTime(provider.timezone, date);
    return provider.windows.some(
      (win) => win.days.includes(w.weekday) && inWindow(w.minutes, parseHM(win.start), parseHM(win.end))
    );
  }

  /**
   * Full evaluation: peak state + next transition instant.
   * Returns { peak, wall, nextTransition: Date | null, secondsUntilTransition }.
   */
  function evaluate(provider, date = new Date()) {
    const wall = wallTime(provider.timezone, date);
    let next = null;
    if (provider.windows.length) {
      const candidates = [];
      for (const win of provider.windows) {
        const start = parseHM(win.start), end = parseHM(win.end);
        for (let k = 0; k <= 8; k++) {
          const dow = (wall.weekday + k) % 7;
          if (!win.days.includes(dow)) continue;
          candidates.push(fromWall(provider.timezone, date, k, Math.floor(start / 60), start % 60));
          // An end earlier than the start belongs to the following day.
          candidates.push(fromWall(provider.timezone, date, end <= start ? k + 1 : k, Math.floor(end / 60), end % 60));
        }
      }
      next = candidates
        .filter((d) => d.getTime() > date.getTime())
        .sort((a, b) => a - b)[0] || null;
    }
    return {
      peak: isPeak(provider, date),
      wall,
      nextTransition: next,
      secondsUntilTransition: next ? Math.round((next - date) / 1000) : null,
    };
  }

  function formatDelta(totalSecs) {
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (v) => String(v).padStart(2, '0');
    return d > 0 ? `${d}d ${h}h ${pad(m)}m` : `${h}h ${pad(m)}m ${pad(s)}s`;
  }

  /** Human-readable schedule, e.g. "Mon–Fri 14:00–18:00 (UTC+8)". */
  function describeSchedule(provider) {
    if (provider.flat) return 'Flat pricing — no peak hours';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysLabel = (days) => {
      const sorted = [...days].sort((a, b) => a - b);
      if (sorted.join() === '1,2,3,4,5') return 'Mon–Fri';
      if (sorted.join() === '0,6') return 'Weekends';
      if (sorted.join() === '0,1,2,3,4,5,6') return 'Daily';
      return sorted.map((d) => dayNames[d]).join(', ');
    };
    return provider.windows.map(
      (w) => `${daysLabel(w.days)} ${w.start}–${w.end}`
    ).join(' · ');
  }

  return { register, all, get, wallTime, isPeak, evaluate, formatDelta, describeSchedule };
})();
