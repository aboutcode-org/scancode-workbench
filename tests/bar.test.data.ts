export const RawModelDataSamples: {
  values: { dataValues: unknown }[];
  attribute: string;
  validatedAttributeValues: unknown[];
}[] = [
  {
    values: [
      {
        dataValues: {
          extension: "",
        },
      },
      {
        dataValues: {
          extension: 4,
        },
      },
      {
        dataValues: {
          extension: ".LICENSE",
        },
      },
      {
        dataValues: {
          extension: null,
        },
      },
      {
        dataValues: {
          extension: undefined,
        },
      },
      {
        dataValues: {
          extension: ".in",
        },
      },
      {
        dataValues: {
          extension: "",
        },
      },
      {
        dataValues: {
          extension: ".toml",
        },
      },
      {
        dataValues: {
          extension: ".rst",
        },
      },
      {
        dataValues: {
          extension: ".txt",
        },
      },
      {
        dataValues: {
          extension: ".txt",
        },
      },
      {
        dataValues: {
          extension: ".ABOUT",
        },
      },
      {
        dataValues: {
          extension: ".cfg",
        },
      },
      {
        dataValues: {
          extension: ".py",
        },
      },
    ],
    attribute: "extension",
    validatedAttributeValues: [
      "",
      4,
      ".LICENSE",
      "No Value detected",
      "No Value detected",
      ".in",
      "",
      ".toml",
      ".rst",
      ".txt",
      ".txt",
      ".ABOUT",
      ".cfg",
      ".py",
    ],
  },
];

export const BarDataSamples: {
  data: unknown[];
  formatted: {
    formattedChartData: { label: string; value: number }[];
    noValueEntriesCount: number;
  };
}[] = [
  {
    data: [
      "",
      ["Copyright (c) 2009 holger krekel"],
      "",
      null,
      undefined,
      "",
      ["Copyright (c) nexB Inc. and others"],
      ["Copyright (c) 2019 nexB Inc."],
      ["MIT"],
      [
        "Copyright (c) nexB Inc. and others",
        "Copyright (c) nexB Inc. and others",
      ],
      "No Value detected",
      ["MIT"],
      ["MIT"],
    ],
    formatted: {
      formattedChartData: [
        {
          label: "MIT",
          value: 3,
        },
        {
          label: "Copyright (c) 2009 holger krekel",
          value: 1,
        },
        {
          label: "Copyright (c) nexB Inc. and others",
          value: 1,
        },
        {
          label: "Copyright (c) 2019 nexB Inc.",
          value: 1,
        },
        {
          label:
            "Copyright (c) nexB Inc. and others,Copyright (c) nexB Inc. and others",
          value: 1,
        },
      ],
      noValueEntriesCount: 6,
    },
  },
];
