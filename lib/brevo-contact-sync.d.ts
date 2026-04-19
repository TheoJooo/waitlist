export type WaitlistBrevoContact = {
  email: string;
  name?: string | null;
  gender?: string | null;
  categories?: string | string[] | null;
  favouriteDesigners?: string | null;
};

export type BrevoSyncResult =
  | {
      ok: true;
      status: number;
    }
  | {
      ok: false;
      kind: 'config' | 'invalid_input' | 'request' | 'response';
      error: string;
      status?: number;
      body?: string;
    };

declare const brevoContactSync: {
  getBrevoConfigError(env?: NodeJS.ProcessEnv): string | null;
  buildBrevoContactPayload(
    contact: WaitlistBrevoContact,
    env?: NodeJS.ProcessEnv
  ):
    | {
        email: string;
        listIds: number[];
        updateEnabled: true;
        attributes?: Record<string, string | string[]>;
      }
    | null;
  syncWaitlistContactToBrevo(
    contact: WaitlistBrevoContact,
    options?: {
      env?: NodeJS.ProcessEnv;
      fetchImpl?: typeof fetch;
    }
  ): Promise<BrevoSyncResult>;
};

export default brevoContactSync;
