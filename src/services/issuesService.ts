import type { Schemas } from '../types';
import { IssuesRepository } from '../repositories';
import { v4 as uuidv4 } from 'uuid';
import { StandardError } from '../middlewares';

function getIssues(): Array<Schemas['Issue']> {
  return IssuesRepository.getIssues();
}

function getIssue(id: Schemas['Issue']['id']): Schemas['Issue'] {
  return IssuesRepository.getIssue(id);
}

function createIssue({ title, description }: Pick<Schemas['Issue'], 'title' | 'description'>): Schemas['Issue'] {
  const id = uuidv4();
  const issue: Schemas['Issue'] = {
    id,
    title,
    description,
    state: 'opened',
  };
  return IssuesRepository.createIssue(issue);
}

function editIssue(
  id: Schemas['Issue']['id'],
  edit: Pick<Schemas['Issue'], 'title' | 'description'>,
): Schemas['Issue'] {
  return IssuesRepository.editIssue(id, edit);
}

function deleteIssue(id: Schemas['Issue']['id']): Schemas['Issue'] {
  return IssuesRepository.removeIssue(id);
}

function moveToClosed(id: Schemas['Issue']['id']): Schemas['Issue'] {
  const currentIssue = IssuesRepository.getIssue(id);
  if (currentIssue.state === 'closed') {
    throw new StandardError(`Issue ${id} was already closed`, 400);
  }
  return IssuesRepository.editIssue(id, { state: 'closed' });
}

function moveToPending(id: Schemas['Issue']['id']): Schemas['Issue'] {
  const currentIssue = IssuesRepository.getIssue(id);
  if (currentIssue.state === 'closed') {
    throw new StandardError(`Issue ${id} was already closed`, 400);
  }
  if (currentIssue.state === 'pending') {
    throw new StandardError(`Issue ${id} was already pending`, 400);
  }
  return IssuesRepository.editIssue(id, { state: 'pending' });
}

const IssuesService = {
  getIssues,
  getIssue,
  createIssue,
  editIssue,
  deleteIssue,
  moveToClosed,
  moveToPending,
};
export { IssuesService };
