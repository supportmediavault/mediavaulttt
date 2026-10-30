/**
 * A tiny task queue that runs at most `concurrency` tasks at the same time.
 * Used so that converting 50 images does not start 50 heavy jobs at once
 * (which would exhaust memory on phones).
 */
export class TaskQueue {
  private running = 0;
  private pending: Array<() => void> = [];

  constructor(private concurrency: number) {}

  setConcurrency(value: number): void {
    this.concurrency = Math.max(1, value);
    this.drain();
  }

  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.pending.push(() => {
        this.running++;
        task()
          .then(resolve, reject)
          .finally(() => {
            this.running--;
            this.drain();
          });
      });
      this.drain();
    });
  }

  private drain(): void {
    while (this.running < this.concurrency && this.pending.length > 0) {
      const next = this.pending.shift();
      next?.();
    }
  }
}
