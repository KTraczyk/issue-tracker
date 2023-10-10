import { StandardError } from '../middlewares';
import type { Schemas } from '../types';
import { MemoryCache } from '../utils/memoryCache';
import { Config } from '../config';

function getIssues(): Array<Schemas['Issue']> {
  return MemoryCache.getAllValues(Config.ISSUES_COLLECTION_KEY) as Array<Schemas['Issue']>;
}

function getIssue(id: Schemas['Issue']['id']): Schemas['Issue'] {
  const issue = MemoryCache.getValue(Config.ISSUES_COLLECTION_KEY, id) as Schemas['Issue'] | undefined;
  if (!issue) {
    throw new StandardError(`Issue ${id} not found`, 404);
  }
  return issue;
}

function createIssue(issue: Schemas['Issue']): Schemas['Issue'] {
  return MemoryCache.setValue(Config.ISSUES_COLLECTION_KEY, issue.id, issue) as Schemas['Issue'];
}

function editIssue(id: Schemas['Issue']['id'], edit: Partial<Schemas['Issue']>): Schemas['Issue'] {
  const currentIssue = getIssue(id);
  const editedIssue = {
    ...currentIssue,
    ...edit,
  };
  return MemoryCache.setValue(Config.ISSUES_COLLECTION_KEY, id, editedIssue) as Schemas['Issue'];
}

function removeIssue(id: Schemas['Issue']['id']): Schemas['Issue'] {
  const removedIssue = getIssue(id);
  MemoryCache.removeValue(Config.ISSUES_COLLECTION_KEY, id);
  return removedIssue;
}

const IssuesRepository = {
  getIssues,
  getIssue,
  createIssue,
  editIssue,
  removeIssue,
};

export { IssuesRepository };
