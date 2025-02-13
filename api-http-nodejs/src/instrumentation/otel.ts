import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks'
import * as api from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'


export function otelSetup() {
  const contextManager = new AsyncHooksContextManager().enable()
  api.context.setGlobalContextManager(contextManager)

  const exporter = new OTLPTraceExporter({ url: "http://otel-collector:4318/v1/traces"});

  const provider = new BasicTracerProvider({
    resource: new Resource({
      ["service.name"]: 'api',
      ["service.version"]: '1.0.0',
    }),
  })

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))

  registerInstrumentations({
    tracerProvider: provider,
  })

  provider.register()
}