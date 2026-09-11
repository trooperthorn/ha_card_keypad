/**
 * A small "digital rain" renderer for the phosphor theme's side panels.
 * Runs on a canvas at a deliberately low frame rate so a wall tablet does not
 * spend its battery or its GPU on decoration; stops when the element leaves
 * the document.
 */

const GLYPHS = "0123456789ABCDEF<>[]{}=+-*/%#@$&";

export class MatrixRain {
  private columns: number[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private context: CanvasRenderingContext2D | null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly color: string,
    private readonly fontSize: number,
    private readonly fps: number,
  ) {
    this.context = canvas.getContext("2d");
  }

  start(): void {
    this.stop();
    this.resize();
    this.timer = setInterval(() => this.frame(), Math.max(50, Math.round(1000 / this.fps)));
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.canvas.width = Math.floor(rect.width);
    this.canvas.height = Math.floor(rect.height);
    const count = Math.max(1, Math.floor(this.canvas.width / this.fontSize));
    this.columns = Array.from({ length: count }, () => Math.floor(Math.random() * -30));
    if (this.context) {
      this.context.fillStyle = "#000";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private frame(): void {
    const ctx = this.context;
    if (!ctx) return;
    const { width, height } = this.canvas;
    if (width === 0 || height === 0) {
      this.resize();
      return;
    }
    // Fade the previous frame instead of clearing it: that is the trail.
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${this.fontSize}px monospace`;
    ctx.textBaseline = "top";
    for (let i = 0; i < this.columns.length; i += 1) {
      const y = this.columns[i] ?? 0;
      const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
      const x = i * this.fontSize;
      ctx.fillStyle = this.color;
      ctx.fillText(glyph, x, y * this.fontSize);
      if (y * this.fontSize > height && Math.random() > 0.96) {
        this.columns[i] = Math.floor(Math.random() * -10);
      } else {
        this.columns[i] = y + 1;
      }
    }
  }
}
