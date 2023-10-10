import { IssuesRepository } from "../../src/repositories";
import { MemoryCache } from "../../src/utils/memoryCache";
import { Config } from "../../src/config";
import { StandardError } from "../../src/middlewares/errorMiddleware";
import {  MockedIssueList, MockedIssueOpen, MockedIssuePending } from "../mocks";


describe("IssuesRepository", () => {
  describe("getIssues", () => {
    it("should return list of issues from cache", () => {
      const cacheSpy = jest.spyOn(MemoryCache, "getAllValues").mockReturnValue(MockedIssueList);

      const list = IssuesRepository.getIssues();

      expect(list).toStrictEqual(MockedIssueList);
      expect(cacheSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY)
    });
  });

  describe("getIssue", () => {
    it("should return issue from cache", () => {
      const mockedId = MockedIssueOpen.id;
      const cacheSpy = jest.spyOn(MemoryCache, "getValue").mockReturnValue(MockedIssueOpen);

      const issue = IssuesRepository.getIssue(mockedId);

      expect(issue).toStrictEqual(MockedIssueOpen);
      expect(cacheSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY, mockedId);
    });

    it("should throw an error if issue was not found", () => {
      const mockedId = MockedIssueOpen.id;
      const cacheSpy = jest.spyOn(MemoryCache, "getValue").mockReturnValue(undefined);
      const expectedError = new StandardError(`Issue ${mockedId} not found`, 404);

      expect(() => IssuesRepository.getIssue(mockedId)).toThrowError(expectedError);
      expect(cacheSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY, mockedId);
    });
  });

  describe("createIssue", () => {
    it("should return created issue", () => {
      const cacheSpy = jest.spyOn(MemoryCache, "setValue").mockReturnValue(MockedIssueOpen);

      const issue = IssuesRepository.createIssue(MockedIssueOpen);

      expect(issue).toStrictEqual(MockedIssueOpen);
      expect(cacheSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY, MockedIssueOpen.id, MockedIssueOpen);
    });
  });

  describe("editIssue", () => {
    it("should return created issue", () => {
      const mockedId = MockedIssueOpen.id;
      const getValueSpy = jest.spyOn(MemoryCache, "getValue").mockReturnValue(MockedIssueOpen);
      const setValueSpy = jest.spyOn(MemoryCache, "setValue").mockReturnValue(MockedIssuePending);

      const issue = IssuesRepository.editIssue(mockedId, { state: MockedIssuePending.state, id: MockedIssuePending.id });

      expect(issue).toStrictEqual(MockedIssuePending);
      expect(getValueSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY, mockedId);
      expect(setValueSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY, mockedId, MockedIssuePending);
    });
  });

  describe("removeIssue", () => {
    it("should return created issue", () => {
      const mockedId = MockedIssueOpen.id;
      const getValueSpy = jest.spyOn(MemoryCache, "getValue").mockReturnValue(MockedIssueOpen);
      const removeValueSpy = jest.spyOn(MemoryCache, "removeValue");

      const issue = IssuesRepository.removeIssue(mockedId);

      expect(issue).toStrictEqual(MockedIssueOpen);
      expect(getValueSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY, MockedIssueOpen.id);
      expect(removeValueSpy).toBeCalledWith(Config.ISSUES_COLLECTION_KEY, MockedIssueOpen.id);
    });
  });
});
