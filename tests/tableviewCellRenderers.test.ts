import { ALL_COLUMNS } from "../src/pages/TableView/columnDefs";

describe("Column Definitions", () => {
  it("should have same keys as their column IDs and field", () => {
    const colDefKeys = Object.keys(ALL_COLUMNS);
    const colDefIds = Object.values(ALL_COLUMNS).map((col) => col.colId);
    const colDefFields = Object.values(ALL_COLUMNS).map((col) => col.field);
    expect(colDefIds).toEqual(colDefKeys);
    expect(colDefFields).toEqual(colDefKeys);
  });
});
