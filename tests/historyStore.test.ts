/**
 * @jest-environment jsdom
 */
import moment from "moment";
import {
  HistoryItem,
  GetHistory,
  AddEntry,
  RemoveEntry,
  HISTORY_MAX_LENGTH,
} from "../src/services/historyStore";

beforeEach(() => {
  // Clear localStorage before each test
  window.localStorage.clear();
});

test("AddEntry should add a new history entry", () => {
  const entry: HistoryItem = {
    opened_at: moment().format(),
    json_path: "path/to/json",
    sqlite_path: "path/to/sqlite",
  };

  AddEntry(entry);

  const history = GetHistory();
  expect(history).toHaveLength(1);
  expect(history[0]).toEqual(entry);
});

describe("AddEntry should update an existing history entry", () => {
  const testCases: {
    description: string;
    initialEntry: HistoryItem;
    updatedEntry: HistoryItem;
  }[] = [
    {
      description: "Existing json import",
      initialEntry: {
        opened_at: moment().format(),
        json_path: "path/to/json",
        sqlite_path: "path/to/sqlite",
      },
      updatedEntry: {
        opened_at: moment().add(1, "days").format(),
        json_path: "path/to/json",
        sqlite_path: "path/to/sqlite",
      },
    },
    {
      description: "Existing sqlite import",
      initialEntry: {
        opened_at: moment().format(),
        sqlite_path: "path/to/sqlite",
      },
      updatedEntry: {
        opened_at: moment().add(1, "days").format(),
        sqlite_path: "path/to/sqlite",
      },
    },
  ];
  it.each(testCases)("$description", ({ initialEntry, updatedEntry }) => {
    AddEntry(initialEntry);
    AddEntry(updatedEntry);

    const history = GetHistory();
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(updatedEntry);
  });
});

test("RemoveEntry should remove an existing history entry", () => {
  const entry: HistoryItem = {
    opened_at: moment().format(),
    json_path: "path/to/json",
    sqlite_path: "path/to/sqlite",
  };

  AddEntry(entry);
  RemoveEntry(entry);

  const history = GetHistory();
  expect(history).toHaveLength(0);
});

test("RemoveEntry should not affect history if entry doesn't exist", () => {
  const entry: HistoryItem = {
    opened_at: moment().format(),
    json_path: "path/to/json",
    sqlite_path: "path/to/sqlite",
  };

  AddEntry(entry);
  const nonExistentEntry: HistoryItem = {
    opened_at: moment().add(1, "days").format(),
    json_path: "non/existent/json",
    sqlite_path: "non/existent/sqlite",
  };

  RemoveEntry(nonExistentEntry);

  const history = GetHistory();
  expect(history).toHaveLength(1);
});

test(`History length should be capped at ${HISTORY_MAX_LENGTH}`, () => {
  for (let i = 0; i < HISTORY_MAX_LENGTH + 2; i++) {
    const entry: HistoryItem = {
      opened_at: moment().format(),
      json_path: `path/to/json/${i}`,
      sqlite_path: `path/to/sqlite/${i}`,
    };
    AddEntry(entry);
  }

  const history = GetHistory();
  expect(history).toHaveLength(HISTORY_MAX_LENGTH);
});

test("History should be sorted by opened_at in descending order", () => {
  const entries: HistoryItem[] = [
    {
      opened_at: moment().subtract(2, "days").format(),
      json_path: "path/to/json/1",
      sqlite_path: "path/to/sqlite/1",
    },
    {
      opened_at: moment().subtract(1, "days").format(),
      json_path: "path/to/json/2",
      sqlite_path: "path/to/sqlite/2",
    },
    {
      opened_at: moment().format(),
      json_path: "path/to/json/3",
      sqlite_path: "path/to/sqlite/3",
    },
  ];

  entries.forEach(AddEntry);

  const history = GetHistory();
  // console.log("after add", history);

  for (let i = 0; i < history.length - 1; i++) {
    const currentEntry = history[i];
    const nextEntry = history[i + 1];
    const currentTimestamp = moment(currentEntry.opened_at);
    const nextTimestamp = moment(nextEntry.opened_at);
    expect(currentTimestamp >= nextTimestamp).toBeTruthy();
  }
});
