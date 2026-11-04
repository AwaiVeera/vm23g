import type {
  D1Database as CfD1Database,
  R2Bucket as CfR2Bucket,
  Ai as CfAi,
  AiModels as CfAiModels,
} from '@cloudflare/workers-types';

declare global {
  type D1Database = CfD1Database;
  type R2Bucket = CfR2Bucket;
  type Ai = CfAi;
  type AiModels = CfAiModels;

  namespace App {
    interface Locals {
      admin?: string;
      cfContext?: { waitUntil(promise: Promise<unknown>): void };
    }
  }
}

export {};
