import { logger } from './logger';

class MemoryStore {
  private store: Map<string, any> = new Map();
  private expiryTimes: Map<string, number> = new Map();
  private interval: NodeJS.Timeout;

  constructor() {
    // Clean up expired keys every minute
    this.interval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    Array.from(this.expiryTimes.entries()).forEach(([key, expiryTime]) => {
      if (expiryTime <= now) {
        this.store.delete(key);
        this.expiryTimes.delete(key);
      }
    });
  }

  async get(key: string): Promise<string | null> {
    const value = this.store.get(key);
    if (!value) return null;

    const expiryTime = this.expiryTimes.get(key);
    if (expiryTime && expiryTime <= Date.now()) {
      this.store.delete(key);
      this.expiryTimes.delete(key);
      return null;
    }

    return value;
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<'OK'> {
    this.store.set(key, value);
    if (expirySeconds) {
      this.expiryTimes.set(key, Date.now() + (expirySeconds * 1000));
    }
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const exists = this.store.has(key);
    if (exists) {
      this.store.delete(key);
      this.expiryTimes.delete(key);
    }
    return exists ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const value = parseInt(this.store.get(key) || '0') + 1;
    this.store.set(key, value.toString());
    return value;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (this.store.has(key)) {
      this.expiryTimes.set(key, Date.now() + (seconds * 1000));
      return 1;
    }
    return 0;
  }

  async hSet(key: string, field: string | object, value?: string): Promise<number> {
    if (typeof field === 'object') {
      Object.entries(field).forEach(([k, v]) => {
        this.store.set(`${key}:${k}`, v);
      });
    } else if (value !== undefined) {
      this.store.set(`${key}:${field}`, value);
    }
    return 1;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return Array.from(this.store.keys()).filter(key => regex.test(key));
  }

  async quit(): Promise<void> {
    clearInterval(this.interval);
    this.store.clear();
    this.expiryTimes.clear();
  }
}

// Create a singleton instance
const memoryStore = new MemoryStore();

export { memoryStore }; 