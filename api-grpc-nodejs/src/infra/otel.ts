// Imports
import opentelemetry from '@opentelemetry/api';

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks'
import * as api from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

export function otelSetup() {
  const contextManager = new AsyncHooksContextManager().enable()

  api.context.setGlobalContextManager(contextManager)
  const exporter = new OTLPTraceExporter({ url: "http://otel-collector:4318/v1/traces"});
  const metricExporter = new OTLPMetricExporter({
    url: "http://otel-collector:4318/v1/metrics",
  });

  const provider = new BasicTracerProvider({
    resource: new Resource({
      ['service.name']: 'cotacao-grpc',
      ['service.version']: '1.0.0',
    }),
  })

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000,
  });

  const myServiceMeterProvider = new MeterProvider({
    resource: new Resource({
      ['service.name']: 'cotacao-grpc',
      ['service.version']: '1.0.0',
    }),
    readers: [metricReader],
  });


  opentelemetry.metrics.setGlobalMeterProvider(myServiceMeterProvider);

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      getNodeAutoInstrumentations(),
      new WinstonInstrumentation({
        logHook: (span, record) => {
          record['resource.service.name'] = 'cotaca-grpc';
        },
      }),
    ],
  })

  provider.register()
}