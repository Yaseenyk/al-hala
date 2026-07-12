import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * The database. SQLite, via Node's BUILT-IN `node:sqlite` — zero dependencies, real ACID
 * transactions, and a single file on disk.
 *
 * ⚠️ DEPLOYMENT CONSTRAINT, READ THIS BEFORE DEPLOYING:
 *
 * A SQLite file only works where the filesystem PERSISTS and there is ONE writer. That
 * means a VPS, a container with a volume, Railway, Fly, a Raspberry Pi in the shop.
 *
 * It does NOT work on Vercel/Netlify/Lambda: those filesystems are ephemeral and
 * per-invocation, so every order would be written to a disk that is thrown away moments
 * later, and you would lose orders silently — the worst possible failure mode, because
 * nothing errors.
 *
 * If you deploy serverless, swap this module for Postgres (Neon/Supabase). Everything above
 * it — the repository functions, the actions, the pages — talks to `orders.ts` and not to
 * this file, so that swap is one module, not a rewrite. That is why the seam is here.
 */

const DB_PATH = process.env.DATABASE_PATH ?? ".data/alhala.db";

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (db) return db;

  mkdirSync(dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);

  // WAL: readers do not block the writer. Without it, a single slow read can lock out an
  // incoming order — and an order that fails because someone was browsing is inexcusable.
  db.exec("PRAGMA journal_mode = WAL");
  // Without foreign_keys ON, SQLite silently ignores every FK constraint you declared.
  db.exec("PRAGMA foreign_keys = ON");

  migrate(db);
  return db;
}

function migrate(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      reference    TEXT    NOT NULL UNIQUE,
      status       TEXT    NOT NULL DEFAULT 'pending',

      customer_name  TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address_line   TEXT NOT NULL,
      city           TEXT NOT NULL,
      postal_code    TEXT NOT NULL,
      is_gift        INTEGER NOT NULL DEFAULT 0,
      gift_note      TEXT,

      -- Integer minor units (paise). NEVER REAL: floats cannot represent 0.1 exactly, and
      -- a currency column that drifts by a paisa per row is a reconciliation nightmare
      -- that surfaces months later.
      subtotal   INTEGER NOT NULL,
      delivery   INTEGER NOT NULL,
      total      INTEGER NOT NULL,

      -- The priced, server-computed snapshot. Stored so an order can be reprinted exactly
      -- as it was sold, even after the catalogue changes underneath it.
      priced_json TEXT NOT NULL,
      -- The lean BoxPayloads as submitted. Kept for audit and for re-order.
      payload_json TEXT NOT NULL,

      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
    CREATE INDEX IF NOT EXISTS idx_orders_created  ON orders(created_at);

    CREATE TABLE IF NOT EXISTS enquiries (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
