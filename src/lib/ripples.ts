/**
 * Mô phỏng mặt nước 1 chiều (spring + lan truyền), port đúng theo trang gốc.
 * Dùng cho sóng trong stat box.
 */
export class Ripples {
  cols: number;
  h: Float32Array;
  v: Float32Array;
  spring: number;
  damp: number;
  spread: number;
  passes: number;

  constructor(
    cols: number,
    opts: { spring?: number; damp?: number; spread?: number; passes?: number } = {},
  ) {
    this.cols = cols;
    this.h = new Float32Array(cols);
    this.v = new Float32Array(cols);
    this.spring = opts.spring ?? 0.024;
    this.damp = opts.damp ?? 0.968;
    this.spread = opts.spread ?? 0.19;
    this.passes = opts.passes ?? 2;
  }

  step() {
    const { h, v, cols, spring, damp, spread, passes } = this;
    for (let i = 0; i < cols; i++) {
      v[i] += -spring * h[i];
      v[i] *= damp;
      h[i] += v[i];
    }
    for (let p = 0; p < passes; p++) {
      for (let i = 0; i < cols; i++) {
        if (i > 0) v[i - 1] += spread * (h[i] - h[i - 1]);
        if (i < cols - 1) v[i + 1] += spread * (h[i] - h[i + 1]);
      }
    }
  }

  splash(pos: number, power: number, width = 3) {
    const { h, v, cols } = this;
    const c = Math.round(pos * (cols - 1));
    for (let i = -width; i <= width; i++) {
      const j = c + i;
      if (j < 0 || j >= cols) continue;
      v[j] += power * (1 - Math.abs(i) / (width + 1));
    }
    for (let i = 0; i < cols; i++) {
      if (h[i] > 40) h[i] = 40;
      if (h[i] < -40) h[i] = -40;
    }
  }

  press(pos: number, target: number, strength: number, width = 3) {
    const { h, v, cols } = this;
    const c = Math.round(pos * (cols - 1));
    for (let i = -width; i <= width; i++) {
      const j = c + i;
      if (j < 0 || j >= cols) continue;
      const w = 1 - Math.abs(i) / (width + 1);
      v[j] += (target - h[j]) * strength * w;
    }
  }

  heightAt(pos: number) {
    const { h, cols } = this;
    const f = Math.max(0, Math.min(1, pos)) * (cols - 1);
    const i = Math.floor(f);
    const j = Math.min(cols - 1, i + 1);
    return h[i] + (h[j] - h[i]) * (f - i);
  }

  slopeAt(pos: number) {
    const d = 1 / this.cols;
    return this.heightAt(pos + d) - this.heightAt(pos - d);
  }
}
