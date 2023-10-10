import Router from 'koa-router';

import { createIssuesController } from './controllers';

const router = new Router();

const issuesController = createIssuesController();
router.get('/v1/issues', issuesController.getIssues);
router.post('/v1/issues', issuesController.createIssue);
router.get('/v1/issues/:issueId', issuesController.getIssue);
router.get('/v1/issues/:issueId', issuesController.getIssue);
router.delete('/v1/issues/:issueId', issuesController.removeIssue);
router.put('/v1/issues/:issueId', issuesController.editIssue);
router.post('/v1/issues/:issueId/:issueEvent', issuesController.issueEvent);

export { router };
