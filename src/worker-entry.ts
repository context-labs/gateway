import { instrument } from '@inference-net/otel-cf-workers';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import app from './index';

const handler = {
  fetch: app.fetch,
} satisfies ExportedHandler<any>;

// Export the app
export default instrument(handler, (env, _trigger) => {
  const hasHasOTLP = env.OTLP_ENDPOINT != undefined && env.OTLP_ENDPOINT != '';
  const otlpHasApiKey = env.OTLP_API_KEY != undefined && env.OTLP_API_KEY != '';

  return {
    service: {
      name: 'portkey',
      namespace: env.ENVIRONMENT,
      version: env.CF_VERSION_METADATA.tag,
    },
    trace: hasHasOTLP
      ? {
          exporter: {
            url: `${env.OTLP_ENDPOINT}/v1/traces`,
            headers: otlpHasApiKey
              ? { Authorization: `Bearer ${env.OTLP_API_KEY}` }
              : undefined,
          },
          spanProcessors: new CompositePropagator({
            propagators: [
              new W3CTraceContextPropagator(),
              new W3CBaggagePropagator(),
            ],
          }),
        }
      : undefined,
  };
});
