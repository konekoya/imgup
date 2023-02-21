import ConfigStore from 'configstore';
import { getPackageMeta } from './utils.js';

interface Instance {
  get(key: string): string;
  set(key: string, value: string): void;
  has(key: string): boolean;
}

class Config {
  private static instance: Config;
  private store: ConfigStore;
  private constructor() {
    const { name: appName } = getPackageMeta();
    this.store = new ConfigStore(appName);
  }

  public static getInstance(): Instance {
    if (!Config.instance) {
      Config.instance = new Config();
    }

    return Config.instance;
  }

  public get(key: string): string {
    return this.store.get(key);
  }

  public set(key: string, value: string): void {
    this.store.set(key, value);
  }

  public has(key: string): boolean {
    return this.store.has(key);
  }
}

export default Config;
