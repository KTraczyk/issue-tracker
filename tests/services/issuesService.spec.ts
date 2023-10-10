import { IssuesService } from "../../src/services";
import { IssuesRepository } from "../../src/repositories";
import { StandardError } from "../../src/middlewares/errorMiddleware";
import {  MockedIssueBase, MockedIssueClosed, MockedIssueList, MockedIssueOpen, MockedIssuePending } from "../mocks";
import * as uuid from 'uuid';
jest.mock('uuid');

describe("IssuesService", () => {
  describe("getIssues", () => {
    it("should return list of issues from repository", () => {
      const repositorySpy = jest.spyOn(IssuesRepository, "getIssues").mockReturnValue(MockedIssueList);

      const list = IssuesService.getIssues();

      expect(list).toStrictEqual(MockedIssueList);
      expect(repositorySpy).toBeCalledWith();
    });
  });

  describe("getIssue", () => {
    it("should return issue from repository with given id", () => {
      const mockedId = MockedIssueOpen.id;
      const repositorySpy = jest.spyOn(IssuesRepository, "getIssue").mockReturnValue(MockedIssueOpen);

      const issue = IssuesService.getIssue(mockedId);

      expect(issue).toStrictEqual(MockedIssueOpen);
      expect(repositorySpy).toBeCalledWith(mockedId);
    });
  });

  describe("createIssue", () => {
    it("should return created issue from repository with given title and description with opened state", () => {
      const mockedId = MockedIssueOpen.id;

      jest.spyOn(uuid, 'v4').mockReturnValue(mockedId);
      const repositorySpy = jest.spyOn(IssuesRepository, "createIssue").mockReturnValue(MockedIssueOpen);

      const issue = IssuesService.createIssue(MockedIssueBase);

      expect(issue).toStrictEqual(MockedIssueOpen);
      expect(repositorySpy).toBeCalledWith({
        ...MockedIssueBase,
        id: mockedId,
        state: "opened",
      });
    });
  });

  describe("editIssue", () => {
    it("should return edited issue from reposiotry", () => {
      const mockedId = MockedIssueOpen.id;
      const repositorySpy = jest.spyOn(IssuesRepository, "editIssue").mockReturnValue(MockedIssueOpen);

      const issue = IssuesService.editIssue(mockedId, MockedIssueBase);

      expect(issue).toStrictEqual(MockedIssueOpen);
      expect(repositorySpy).toBeCalledWith(mockedId, MockedIssueBase);
    });
  });

  describe("removeIssue", () => {
    it("should return removed issue from reposiotry", () => {
      const mockedId = MockedIssueOpen.id;
      const repositorySpy = jest.spyOn(IssuesRepository, "removeIssue").mockReturnValue(MockedIssueOpen);

      const issue = IssuesService.deleteIssue(mockedId);

      expect(issue).toStrictEqual(MockedIssueOpen);
      expect(repositorySpy).toBeCalledWith(mockedId);
    });
  });

  describe("moveToClosed", () => {
    it("should return closed issue from repository", () => {
      const mockedId = MockedIssueOpen.id;
      const getIssueSpy = jest.spyOn(IssuesRepository, "getIssue").mockReturnValue(MockedIssueOpen);
      const editIssueSpy = jest.spyOn(IssuesRepository, "editIssue").mockReturnValue(MockedIssueClosed);

      const issue = IssuesService.moveToClosed(mockedId);

      expect(issue).toStrictEqual(MockedIssueClosed);
      expect(getIssueSpy).toBeCalledWith(mockedId);
      expect(editIssueSpy).toBeCalledWith(mockedId, { state: "closed" });
    });

    it ("should throw error if issue is already closed", () => {
      const mockedId = MockedIssueOpen.id;
      const getIssueSpy = jest.spyOn(IssuesRepository, "getIssue").mockReturnValue(MockedIssueClosed);
      const editIssueSpy = jest.spyOn(IssuesRepository, "editIssue");
      const expectedError = new StandardError(`Issue ${mockedId} was already closed`, 400)
  
      expect(() => IssuesService.moveToClosed(mockedId)).toThrow(expectedError);
      expect(getIssueSpy).toBeCalledWith(mockedId);
      expect(editIssueSpy).not.toBeCalled();
    });
  });

  describe("moveToPending", () => {
    it("should return pending issue from repository", () => {
      const mockedId = MockedIssueOpen.id;
      const getIssueSpy = jest.spyOn(IssuesRepository, "getIssue").mockReturnValue(MockedIssueOpen);
      const editIssueSpy = jest.spyOn(IssuesRepository, "editIssue").mockReturnValue(MockedIssuePending);

      const issue = IssuesService.moveToPending(mockedId);

      expect(issue).toStrictEqual(MockedIssuePending);
      expect(getIssueSpy).toBeCalledWith(mockedId);
      expect(editIssueSpy).toBeCalledWith(mockedId, { state: "pending" });
    });

    it ("should throw error if issue is already pending", () => {
      const mockedId = MockedIssueOpen.id;
      const getIssueSpy = jest.spyOn(IssuesRepository, "getIssue").mockReturnValue(MockedIssuePending);
      const editIssueSpy = jest.spyOn(IssuesRepository, "editIssue");
      const expectedError = new StandardError(`Issue ${mockedId} was already pending`, 400)
  
      expect(() => IssuesService.moveToPending(mockedId)).toThrow(expectedError);
      expect(getIssueSpy).toBeCalledWith(mockedId);
      expect(editIssueSpy).not.toBeCalled();
    });

    it ("should throw error if issue is already closed", () => {
      const mockedId = MockedIssueOpen.id;
      const getIssueSpy = jest.spyOn(IssuesRepository, "getIssue").mockReturnValue(MockedIssueClosed);
      const editIssueSpy = jest.spyOn(IssuesRepository, "editIssue");
      const expectedError = new StandardError(`Issue ${mockedId} was already closed`, 400)
  
      expect(() => IssuesService.moveToPending(mockedId)).toThrow(expectedError);
      expect(getIssueSpy).toBeCalledWith(mockedId);
      expect(editIssueSpy).not.toBeCalled();
    });
  });
});
