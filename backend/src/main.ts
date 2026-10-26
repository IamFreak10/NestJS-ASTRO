import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API route prefix
  app.setGlobalPrefix('api');

  // Parse allowed origins from environment
  const rawOrigins =
    process.env.TRUSTED_ORIGINS ||
    'http://localhost:3000,http://localhost:4321,https://mahfuj-sends-greetings.xyz,https://www.mahfuj-sends-greetings.xyz,https://api.mahfuj-sends-greetings.xyz';

  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  // Production-grade Dynamic CORS Configuration
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps, curl, server-side fetch, cPanel health checks)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      const isExplicitlyAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        allowedOrigins.includes('*') ||
        /\.vercel\.app$/.test(normalizedOrigin);
      const isSubdomainAllowed =
        /^https:\/\/([a-z0-9-]+\.)*mahfuj-sends-greetings\.xyz$/.test(normalizedOrigin);
      const isLocalhost =
        /^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalizedOrigin);

      if (isExplicitlyAllowed || isSubdomainAllowed || isLocalhost) {
        callback(null, true);
      } else {
        callback(new Error(`Blocked by CORS policy: Origin ${origin} is not allowed.`));
      }
    },
    credentials: true, // Crucial for Better Auth session cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cookie',
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
