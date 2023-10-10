import { createIssuesController } from "../../src/controllers";
import { createMockContext } from '@shopify/jest-koa-mocks';
import { IssuesService } from '../../src/services';
import {  MockedIssueBase, MockedIssueClosed, MockedIssueList, MockedIssueOpen, MockedIssuePending } from "../mocks";


describe('Issues Controller', () => {
  const issuesController = createIssuesController();

  describe('getIssues', () => {
    it('should return list of issues', () => {
      const ctx = createMockContext();
      const serviceSpy = jest.spyOn(IssuesService, "getIssues").mockReturnValue(MockedIssueList);

      issuesController.getIssues(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(MockedIssueList);
      expect(serviceSpy).toBeCalledWith();
    });
  });

  describe('getIssue', () => {
    it('should return issue', () => {
      const issueId = MockedIssueOpen.id;
      const ctx = createMockContext({
        customProperties: {
          params: {
            issueId,
          },
        },
      });
      const serviceSpy = jest.spyOn(IssuesService, "getIssue").mockReturnValue(MockedIssueOpen);

      issuesController.getIssue(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(MockedIssueOpen);
      expect(serviceSpy).toBeCalledWith(issueId);
    });
  });

  describe('createIssue', () => {
    it('should return created issue', () => {
      const mockedBody = MockedIssueBase;
      const ctx = createMockContext({
        requestBody: mockedBody,
      });
      const serviceSpy = jest.spyOn(IssuesService, "createIssue").mockReturnValue(MockedIssueOpen);

      issuesController.createIssue(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(MockedIssueOpen);
      expect(serviceSpy).toBeCalledWith(mockedBody);
    });
  });

  describe('editIssue', () => {
    it('should return edited issue', () => {
      const issueId = MockedIssueOpen.id;
      const mockedBody = MockedIssueBase;
      const ctx = createMockContext({
        requestBody: mockedBody,
        customProperties: {
          params: {
            issueId,
          },
        },
      });
      const serviceSpy = jest.spyOn(IssuesService, "editIssue").mockReturnValue(MockedIssueOpen);

      issuesController.editIssue(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(MockedIssueOpen);
      expect(serviceSpy).toBeCalledWith(issueId, mockedBody);
    });
  });

  describe('removeIssue', () => {
    it('should return removed issue', () => {
      const issueId = MockedIssueOpen.id;
      const ctx = createMockContext({
        customProperties: {
          params: {
            issueId,
          },
        },
      });
      const serviceSpy = jest.spyOn(IssuesService, "deleteIssue").mockReturnValue(MockedIssueOpen);

      issuesController.removeIssue(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(MockedIssueOpen);
      expect(serviceSpy).toBeCalledWith(issueId);
    });
  });

  describe('issueEvent', () => {
    it('should return closed issue if event is moveToClosed', () => {
      const issueId = MockedIssueClosed.id;
      const issueEvent = "moveToClosed";
      const ctx = createMockContext({
        customProperties: {
          params: {
            issueId,
            issueEvent,
          },
        },
      });
      const moveToClosedSpy = jest.spyOn(IssuesService, "moveToClosed").mockReturnValue(MockedIssueClosed);
      const moveToPendingSpy = jest.spyOn(IssuesService, "moveToPending");

      issuesController.issueEvent(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(MockedIssueClosed);
      expect(moveToClosedSpy).toBeCalledWith(issueId);
      expect(moveToPendingSpy).not.toBeCalled();
    });

    it('should return pending issue if event is moveToPending', () => {
      const issueId = MockedIssueClosed.id;
      const issueEvent = "moveToPending";
      const ctx = createMockContext({
        customProperties: {
          params: {
            issueId,
            issueEvent,
          },
        },
      });
      const moveToClosedSpy = jest.spyOn(IssuesService, "moveToClosed");
      const moveToPendingSpy = jest.spyOn(IssuesService, "moveToPending").mockReturnValue(MockedIssuePending);

      issuesController.issueEvent(ctx);

      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual(MockedIssuePending);
      expect(moveToClosedSpy).not.toBeCalled();
      expect(moveToPendingSpy).toBeCalledWith(issueId);
    });
  });
});
