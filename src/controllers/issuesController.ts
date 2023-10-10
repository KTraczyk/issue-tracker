import { ParameterizedContext } from 'koa';
import type { RequestBodies, Responses, Parameters } from '../types';
import { IssuesService } from '../services';

function createIssuesController() {
  function getIssues(ctx: ParameterizedContext) {
    const issuesList: Responses['IssuesListResponse'] = IssuesService.getIssues();
    ctx.body = issuesList;
  }

  function getIssue(ctx: ParameterizedContext) {
    const id = ctx.params.issueId as Parameters['IssueId'];
    const issuesList: Responses['IssueResponse'] = IssuesService.getIssue(id);
    ctx.body = issuesList;
  }

  function createIssue(ctx: ParameterizedContext) {
    const issueData = ctx.request.body as RequestBodies['IssueBody'];
    const newIssue: Responses['IssueResponse'] = IssuesService.createIssue(issueData);
    ctx.body = newIssue;
  }

  function editIssue(ctx: ParameterizedContext) {
    const id = ctx.params.issueId as Parameters['IssueId'];
    const issueData = ctx.request.body as RequestBodies['IssueBody'];
    const editedIssue: Responses['IssueResponse'] = IssuesService.editIssue(id, issueData);
    ctx.body = editedIssue;
  }

  function removeIssue(ctx: ParameterizedContext) {
    const id = ctx.params.issueId as Parameters['IssueId'];
    const removedIssue: Responses['IssueResponse'] = IssuesService.deleteIssue(id);
    ctx.body = removedIssue;
  }

  function issueEvent(ctx: ParameterizedContext) {
    const id = ctx.params.issueId as Parameters['IssueId'];
    const event = ctx.params.issueEvent as Parameters['IssueEvent'];
    let editedIssue: Responses['IssueResponse'];
    switch (event) {
      case 'moveToClosed':
        editedIssue = IssuesService.moveToClosed(id);
        break;
      case 'moveToPending':
        editedIssue = IssuesService.moveToPending(id);
        break;
    }
    ctx.body = editedIssue;
  }

  return {
    getIssues,
    getIssue,
    createIssue,
    editIssue,
    removeIssue,
    issueEvent,
  };
}

export { createIssuesController };
