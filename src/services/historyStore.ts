import moment from "moment";

export interface HistoryItem {
  opened_at: string;
  json_path?: string;
  sqlite_path: string;
}

export const HISTORY_STORE_KEY = "workbench_history_details";
export const HISTORY_MAX_LENGTH = 5;

export const GetHistory = () => {
  const history = JSON.parse(
    window.localStorage.getItem(HISTORY_STORE_KEY) || "[]"
  ) as HistoryItem[];
  history.sort(function (a, b) {
    return Number(moment(b.opened_at)) - Number(moment(a.opened_at));
  });

  return JSON.parse(
    window.localStorage.getItem(HISTORY_STORE_KEY) || "[]"
  ) as HistoryItem[];
};

export const AddEntry = (entry: HistoryItem) => {
  const history = GetHistory();

  const existingEntry = history.find((existingEntry) =>
    entry.json_path
      ? entry.json_path === existingEntry.json_path
      : entry.sqlite_path === existingEntry.sqlite_path
  );

  if (existingEntry) {
    // console.log("Updating existing entry:", existingEntry);
    existingEntry.opened_at = entry.opened_at;
    existingEntry.sqlite_path = entry.sqlite_path;
    history.sort(function (a, b) {
      return Number(moment(b.opened_at)) - Number(moment(a.opened_at));
    });
  } else {
    // console.log("Adding new history entry:", entry);
    history.unshift(entry);
  }

  if (history.length > 5) history.length = 5;

  window.localStorage.setItem(HISTORY_STORE_KEY, JSON.stringify(history));
};

export const RemoveEntry = (entry: HistoryItem) => {
  const history = GetHistory();

  const existingEntryIndex = history.findIndex(
    (existingEntry) =>
      entry.json_path === existingEntry.json_path ||
      entry.sqlite_path === existingEntry.sqlite_path
  );

  if (existingEntryIndex != -1) {
    history.splice(existingEntryIndex, 1);
    if (history.length > 5) history.length = 5;
    history.sort(function (a, b) {
      return (
        Number(moment(b.opened_at).format("X")) -
        Number(moment(a.opened_at).format("X"))
      );
    });
  }

  window.localStorage.setItem(HISTORY_STORE_KEY, JSON.stringify(history));
};
