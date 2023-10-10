import { Schemas } from "../src/types"

export const MockedIssueBase = {
  title: "Mocked Issue",
  description: "Mocked Issue Description",
}

export const MockedIssueOpen: Schemas['Issue'] = {
  ...MockedIssueBase,
  state: "opened",
  id: "ee601d9e-ed8a-41a9-9738-8715af6c20da",
}

export const MockedIssuePending: Schemas['Issue'] = {
  ...MockedIssueBase,
  state: "pending",
  id: "8c1c090c-8fd1-4f61-a8b0-578a73470be7",
}

export const MockedIssueClosed: Schemas['Issue'] = {
  ...MockedIssueBase,
  state: "closed",
  id: "1297308e-75f3-4d2a-8419-f6ddd98ef140",
}

export const MockedIssueList: Array<Schemas["Issue"]> = [
  MockedIssueOpen,
  MockedIssuePending,
  MockedIssueClosed,
]