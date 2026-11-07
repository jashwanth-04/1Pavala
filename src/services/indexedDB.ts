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

/**
 * Open the native IndexedDB database with schema initialization
 */
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

        // Expenses object store with indexed dates and categories
        if (!db.objectStoreNames.contains(STORES.EXPENSES)) {
          const expenseStore = db.createObjectStore(STORES.EXPENSES, { keyPath: 'id' });
          expenseStore.createIndex('date', 'date', { unique: false });
          expenseStore.createIndex('categoryId', 'categoryId', { unique: false });
        }

        // Categories store
        if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
          db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
        }

        // Budgets store
        if (!db.objectStoreNames.contains(STORES.BUDGETS)) {
          const budgetStore = db.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
          budgetStore.createIndex('month', 'month', { unique: false });
        }

        // User settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }

        // App metadata store (initialized flags, versioning)
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

        // Automatically request persistent storage permission
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

/**
 * Request the browser to mark 1Pavala storage as persistent.
 * Persistent storage prevents the browser from evicting IndexedDB
 * during cache clears or under low disk pressure.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Check if the browser currently considers storage persistent
 */
export async function isStoragePersisted(): Promise<boolean> {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persisted) {
    try {
      return await navigator.storage.persisted();
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Retrieve storage estimate (usage and quota in bytes)
 */
export async function getStorageEstimate(): Promise<{ usage: number; quota: number; isPersisted: boolean } | null> {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const isPersisted = await isStoragePersisted();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        isPersisted,
      };
    } catch {
      return null;
    }
  }
  return null;
}

// -------------------------------------------------------------
// GENERIC STORE HELPERS
// -------------------------------------------------------------

async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => resolve([]);
    } catch {
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
      tx.onerror = () => resolve();
    } catch {
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
      tx.onerror = () => resolve();
    } catch {
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
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// -------------------------------------------------------------
// TYPED INDEXED-DB API METHODS
// -------------------------------------------------------------

export async function idbGetExpenses(): Promise<Expense[]> {
  return getAllFromStore<Expense>(STORES.EXPENSES);
}

export async function idbSaveExpenses(expenses: Expense[]): Promise<void> {
  return setAllInStore<Expense>(STORES.EXPENSES, expenses);
}

export async function idbPutExpense(expense: Expense): Promise<void> {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.EXPENSES, 'readwrite');
      const store = tx.objectStore(STORES.EXPENSES);
      store.put(expense);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function idbDeleteExpense(id: string): Promise<void> {
  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.EXPENSES, 'readwrite');
      const store = tx.objectStore(STORES.EXPENSES);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
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

/**
 * Erase all records from all stores in IndexedDB
 */
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
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}
