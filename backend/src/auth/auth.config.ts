import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer } from 'better-auth/plugins';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../database/schema/index.js';

export const BETTER_AUTH = Symbol('BETTER_AUTH');

export function createBetterAuth(db: MySql2Database<typeof schema>) {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
  const trustedOrigins = (
    process.env.TRUSTED_ORIGINS ||
    'http://localhost:3000,http://localhost:4321,https://mahfuj-sends-greetings.xyz,https://www.mahfuj-sends-greetings.xyz,https://api.mahfuj-sends-greetings.xyz'
  )
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const secret =
    process.env.BETTER_AUTH_SECRET ||
    '53a2b70a970981ce5708a93d50cbbdfbf36818bc773ee03b81b572b9bc9df16a';

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'mysql',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    secret,
    baseURL,
    trustedOrigins,
    plugins: [bearer()],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'student',
          input: false, // Strict security: prevent client privilege escalation
        },
        studentId: {
          type: 'string',
          required: false,
          input: true,
        },
        department: {
          type: 'string',
          required: false,
          input: true,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day sliding rotation
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    advanced: {
      useSecureCookies: isProduction,
      crossSubdomainCookies: {
        enabled: isProduction,
        domain:
          process.env.COOKIE_DOMAIN ||
          (isProduction ? '.mahfuj-sends-greetings.xyz' : undefined),
      },
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        path: '/',
      },
    },
  });
}

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>;
