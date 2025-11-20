import {
  instrument,
  LogsConfig,
  OTLPTransport,
} from '@inference-net/otel-cf-workers';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import app from './index';

const handler = {
  fetch: app.fetch,
} satisfies ExportedHandler<any>;

const parseLogLevel = (level: string): NonNullable<LogsConfig['level']> => {
  const normalized = level.toLowerCase().trim();
  const validLevels = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
  ] as const;

  if (validLevels.includes(normalized as any)) {
    return normalized as NonNullable<LogsConfig['level']>;
  }

  return 'info';
};

// Export the app
export default instrument(handler, (env, _trigger) => {
  const hasHasOTLP = env.OTLP_ENDPOINT != undefined && env.OTLP_ENDPOINT != '';
  const otlpHasApiKey = env.OTLP_API_KEY != undefined && env.OTLP_API_KEY != '';

  return {
    service: {
      name: 'portkey',
      namespace: env.ENVIRONMENT,
      version: env.CF_VERSION_METADATA.id,
    },
    propagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
      ],
    }),
    trace: hasHasOTLP
      ? {
          exporter: {
            url: `${env.OTLP_ENDPOINT}/v1/traces`,
            headers: otlpHasApiKey
              ? { Authorization: `Bearer ${env.OTLP_API_KEY}` }
              : undefined,
          },
        }
      : undefined,
    logs: {
      level: parseLogLevel(env.LOG_LEVEL ?? 'info'),
      instrumentation: {
        instrumentConsole: true,
      },
      transports: [
        ...(hasHasOTLP
          ? [
              new OTLPTransport({
                url: `${env.OTLP_ENDPOINT}/v1/logs`,
                headers: otlpHasApiKey
                  ? { Authorization: `Bearer ${env.OTLP_API_KEY}` }
                  : undefined,
              }),
            ]
          : []),
      ],
    },
  };
});
