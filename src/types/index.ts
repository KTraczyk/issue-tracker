import { components } from './openapi';

type Schemas = components['schemas'];
type RequestBodies = {
  IssueBody: components['requestBodies']['IssueBody']['content']['application/json'];
};
type Responses = {
  IssuesListResponse: components['responses']['IssuesListResponse']['content']['application/json'];
  IssueResponse: components['responses']['IssueResponse']['content']['application/json'];
};
type Parameters = components['parameters'];

export type { Schemas, RequestBodies, Responses, Parameters };
