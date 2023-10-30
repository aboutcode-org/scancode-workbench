import { TodoAttributes } from "../../../src/services/models/todo";

export const TodoSamples: {
  jsonFileName: string;
  expectedTodos: TodoAttributes[];
}[] = [
  { jsonFileName: "empty.json", expectedTodos: [] },
  {
    jsonFileName: "minimal.json",
    expectedTodos: [
      {
        id: 1,
        detection_id: "apache_2_0-971f58ba-4215-35ea-2fc7-494dc41cc264",
        issues:
          '{"imperfect-match-coverage":"The license detection likely is not conslusive as there was license matches with low score or coverage, and so this needs review. scancode would likely benifit from a license rule addition from this case, so please report this to scancode-toolkit github issues."}',
      },
      {
        id: 2,
        detection_id:
          "unknown_license_reference_and_apache_2_0_and_mit-90e87c8b-a130-5b04-2ad1-1b2e9e8d7f50",
        issues:
          '{"unknown-match":"The license detection is inconclusive, as the license matches have been matched to rules having unknown as their license key, and these needs to be reviewed."}',
      },
    ],
  },
];
