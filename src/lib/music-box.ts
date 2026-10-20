/**
 * A tiny, soft "music box" Happy Birthday played with the Web Audio API.
 * Used automatically when /public/music.mp3 is missing.
 */
const N: Record<string, number> = {
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G4: 392,
  G5: 783.99,
  C6: 1046.5,
};

// [note, beats]
const MELODY: Array<[string, number]> = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
];

const BEAT = 0.62; // seconds per beat — slow and dreamy

export class MusicBox {
  private ctx: AudioContext;
  private master: GainNode;
  private timer: number | null = null;
  private nextTime = 0;
  private index = 0;

  constructor() {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;

    // soft echo for a dreamy feel
    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.32;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.28;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.35;
    this.master.connect(this.ctx.destination);
    this.master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(this.ctx.destination);
  }

  private pluck(freq: number, at: number, length: number) {
    const ctx = this.ctx;
    [1, 2].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = freq * mult;
      const peak = i === 0 ? 0.22 : 0.05;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(peak, at + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(1.1, length * 1.6));
      osc.connect(g);
      g.connect(this.master);
      osc.start(at);
      osc.stop(at + Math.max(1.2, length * 1.7));
    });
  }

  private schedule = () => {
    while (this.nextTime < this.ctx.currentTime + 0.6) {
      const [note, beats] = MELODY[this.index] ?? ["C5", 1];
      const dur = beats * BEAT;
      this.pluck(N[note] ?? 523.25, this.nextTime, dur);
      this.nextTime += dur;
      this.index += 1;
      if (this.index >= MELODY.length) {
        this.index = 0;
        this.nextTime += BEAT * 3; // little pause between loops
      }
    }
  };

  start(volume = 0.6) {
    void this.ctx.resume();
    this.nextTime = this.ctx.currentTime + 0.1;
    if (this.timer === null) this.timer = window.setInterval(this.schedule, 150);
    this.setVolume(volume, 2.5);
  }

  setVolume(volume: number, seconds = 1.5) {
    const g = this.master.gain;
    const now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(volume, now + seconds);
  }
}
