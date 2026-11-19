import { Expense, Category, Budget, UserSettings } from '../types';

const DB_NAME = '1pavala_idb_v1';
const DB_VERSION = 1;

export const STORES = {
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',
  SETTINGS: 'settings',
  META: 'meta',
} as const;

let dbInstance: IDBDatabase | null = null;
let initPromise: Promise<IDBDatabase | null> | null = null;

export async function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    console.warn('[1Pavala IDB] IndexedDB is not supported in this browser environment');
    return null;
  }

  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(STORES.EXPENSES)) {
          const expenseStore = db.createObjectStore(STORES.EXPENSES, { keyPath: 'id' });
          expenseStore.createIndex('date', 'date', { unique: false });
          expenseStore.createIndex('categoryId', 'categoryId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
          db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.BUDGETS)) {
          const budgetStore = db.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
          budgetStore.createIndex('month', 'month', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains(STORES.META)) {
          db.createObjectStore(STORES.META, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        dbInstance = request.result;

        dbInstance.onclose = () => {
          dbInstance = null;
          initPromise = null;
        };

        dbInstance.onversionchange = () => {
          if (dbInstance) {
            dbInstance.close();
            dbInstance = null;
            initPromise = null;
          }
        };

        requestPersistentStorage().catch(() => {});
        resolve(dbInstance);
      };

      request.onerror = () => {
        console.error('[1Pavala IDB] Failed to open IndexedDB:', request.error);
        resolve(null);
      };

      request.onblocked = () => {
        console.warn('[1Pavala IDB] IndexedDB upgrade blocked by another open tab');
      };
    } catch (err) {
      console.error('[1Pavala IDB] Exception while opening IndexedDB:', err);
      resolve(null);
    }
  });

  return initPromise;
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      return await navigator.storage.persist();
    } catch {
      return false;
    }
  }
  return false;
}

async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => {
        console.warn(`[1Pavala IndexedDB] getAll error on ${storeName}:`, req.error);
        resolve([]);
      };
    } catch (err) {
      console.warn(`[1Pavala IndexedDB] transaction error on ${storeName}:`, err);
      resolve([]);
    }
  });
}

async function setAllInStore<T>(storeName: string, items: T[]): Promise<void> {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      store.clear();
      for (const item of items) {
        store.put(item);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        console.warn(`[1Pavala IndexedDB] setAll error on ${storeName}:`, tx.error);
        resolve();
      };
    } catch (err) {
      console.warn(`[1Pavala IndexedDB] write transaction error on ${storeName}:`, err);
      resolve();
    }
  });
}

async function putRecord(storeName: string, key: string, value: any): Promise<void> {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put({ key, value });

      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        console.warn(`[1Pavala IndexedDB] putRecord error on ${storeName} [${key}]:`, tx.error);
        resolve();
      };
    } catch (err) {
      console.warn(`[1Pavala IndexedDB] putRecord transaction error on ${storeName} [${key}]:`, err);
      resolve();
    }
  });
}

async function getRecord<T>(storeName: string, key: string): Promise<T | null> {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);

      req.onsuccess = () => {
        const res = req.result;
        resolve(res ? (res.value as T) : null);
      };
      req.onerror = () => {
        console.warn(`[1Pavala IndexedDB] getRecord error on ${storeName} [${key}]:`, req.error);
        resolve(null);
      };
    } catch (err) {
      console.warn(`[1Pavala IndexedDB] getRecord transaction error on ${storeName} [${key}]:`, err);
      resolve(null);
    }
  });
}

export async function idbGetExpenses(): Promise<Expense[]> {
  return getAllFromStore<Expense>(STORES.EXPENSES);
}

export async function idbSaveExpenses(expenses: Expense[]): Promise<void> {
  return setAllInStore<Expense>(STORES.EXPENSES, expenses);
}

export async function idbGetCategories(): Promise<Category[]> {
  return getAllFromStore<Category>(STORES.CATEGORIES);
}

export async function idbSaveCategories(categories: Category[]): Promise<void> {
  return setAllInStore<Category>(STORES.CATEGORIES, categories);
}

export async function idbGetBudgets(): Promise<Budget[]> {
  return getAllFromStore<Budget>(STORES.BUDGETS);
}

export async function idbSaveBudgets(budgets: Budget[]): Promise<void> {
  return setAllInStore<Budget>(STORES.BUDGETS, budgets);
}

export async function idbGetSettings(): Promise<UserSettings | null> {
  return getRecord<UserSettings>(STORES.SETTINGS, 'user_settings');
}

export async function idbSaveSettings(settings: UserSettings): Promise<void> {
  return putRecord(STORES.SETTINGS, 'user_settings', settings);
}

export async function idbHasInitialized(): Promise<boolean> {
  const val = await getRecord<boolean>(STORES.META, 'has_initialized');
  return val === true;
}

export async function idbSetInitialized(): Promise<void> {
  return putRecord(STORES.META, 'has_initialized', true);
}

export async function idbClearAll(): Promise<void> {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(
        [STORES.EXPENSES, STORES.CATEGORIES, STORES.BUDGETS, STORES.SETTINGS, STORES.META],
        'readwrite'
      );
      tx.objectStore(STORES.EXPENSES).clear();
      tx.objectStore(STORES.CATEGORIES).clear();
      tx.objectStore(STORES.BUDGETS).clear();
      tx.objectStore(STORES.SETTINGS).clear();
      tx.objectStore(STORES.META).clear();

      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        console.warn('[1Pavala IndexedDB] clearAll error:', tx.error);
        resolve();
      };
    } catch (err) {
      console.warn('[1Pavala IndexedDB] clearAll transaction error:', err);
      resolve();
    }
  });
}
