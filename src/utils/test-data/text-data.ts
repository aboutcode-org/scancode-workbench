import { BelongsIndicator, DiffComponents } from "../text";

export const TrimTexts: {
  text: string;
  maxLengthInclusive: number;
  trimmed: string;
}[] = [
  { text: undefined, maxLengthInclusive: 30, trimmed: "" },
  { text: null, maxLengthInclusive: 30, trimmed: "" },
  { text: "", maxLengthInclusive: 30, trimmed: "" },
  { text: "abcd", maxLengthInclusive: 30, trimmed: "abcd" },
  { text: "abcdef", maxLengthInclusive: 6, trimmed: "abcdef" },
  { text: "Statement", maxLengthInclusive: 10, trimmed: "Statement" },
  { text: "Statement", maxLengthInclusive: 9, trimmed: "Statement" },
  { text: "Statement", maxLengthInclusive: 8, trimmed: "State..." },
  { text: "Statement", maxLengthInclusive: 7, trimmed: "Stat..." },
  { text: "Statement", maxLengthInclusive: 6, trimmed: "Sta..." },
  {
    text: "License :: OSI Approved :: BSD License",
    maxLengthInclusive: 30,
    trimmed: "License :: OSI Approved :: ...",
  },
  {
    text: "Copyright (c) 2016 - 2019 nexB Inc. and others,Copyright (c) 2016 nexB Inc. and others,Copyright (c) 2008-2015 SpryMedia Limited http://datatables.net,Copyright (c) 2011-2015 Twitter, Inc,Copyright (c) 2015 SpryMedia Limited http://datatables.net,Copyright (c) 2013 Masayuki Tanaka,Copyright 2015 The Chromium Authors,Copyright (c) 2010-2015 SpryMedia Limited http://datatables.net,Copyright (c) 2010-2016, Michael Bostock,Copyright (c) 2008-2015 SpryMedia Limited http://datatables.net,Copyright (c) 2013-2018 GitHub Inc.,Copyright (c) Electron project,Copyright (c) 2010-2015 SpryMedia Limited http://datatables.net,Copyright (c) 2009-2015 SpryMedia Limited http://datatables.net,Copyright (c) 2006-2013 Mika Tuupola, Dylan Verheul,Copyright 2014 jQuery Foundation and other contributors http://jquery.com,Copyright jQuery Foundation and other contributors, https://jquery.org,Copyright jQuery Foundation and other contributors, https://jquery.org,Copyright (c) 2011 Dominic Tarr,Copyright (c) 2014 Ivan Bozhanov,Copyright (c) 2009-2014 Stuart Knightley, David Duponchel, Franz Buchinger,Copyright (c) 2009-2015 SpryMedia Limited http://datatables.net,Copyright (c) 2010-2015 by Lukasz Dziedzic Dziedzic,Copyright (c) 2018 NAN WG Members,Copyright (c) 2014 bpampuch,Copyright (c) 2015 Kimmo Brunfeldt,Copyright (c) 2010, Matt McInerney (matt@pixelspread.com),Copyright (c) 2011",
    maxLengthInclusive: 200,
    trimmed:
      "Copyright (c) 2016 - 2019 nexB Inc. and others,Copyright (c) 2016 nexB Inc. and others,Copyright (c) 2008-2015 SpryMedia Limited http://datatables.net,Copyright (c) 2011-2015 Twitter, Inc,Copyright...",
  },
  {
    text: "nexB Inc. and others,nexB Inc. and others,SpryMedia Limited,Twitter, Inc,SpryMedia Limited,Masayuki Tanaka,The Chromium Authors,SpryMedia Limited,Michael Bostock,SpryMedia Limited,GitHub Inc.,Electron project,SpryMedia Limited,SpryMedia Limited,Mika Tuupola, Dylan Verheul,jQuery Foundation and other contributors,jQuery Foundation and other contributors,jQuery Foundation and other contributors,Dominic Tarr,Ivan Bozhanov,Stuart Knightley, David Duponchel, Franz Buchinger,SpryMedia Limited,Lukasz Dziedzic Dziedzic,NAN WG Members,bpampuch,Kimmo Brunfeldt,Matt McInerney,Pablo Impallari,Rodrigo Fuenzalida,SpryMedia Limited,SpryMedia Limited,SpryMedia Limited,SpryMedia Limited,SpryMedia Limited,Kevin Brown, Igor Vaynberg, and Select2 contributors,Sequelize contributors,Nathan Cahill,MapBox,Iron Summit Media Strategies, LLC.,Dominic Tarr,Sindre Sorhus,Sindre Sorhus,Rebecca Turner,Mark Cavage,Mark Cavage,Alex Indigo,Michael Hart,Stefan Penner,Tim Caswell,Free Software Foundation, Inc.,Free Software Foundation, Inc.,the Free Software Foundation",
    maxLengthInclusive: 200,
    trimmed:
      "nexB Inc. and others,nexB Inc. and others,SpryMedia Limited,Twitter, Inc,SpryMedia Limited,Masayuki Tanaka,The Chromium Authors,SpryMedia Limited,Michael Bostock,SpryMedia Limited,GitHub Inc.,Elect...",
  },
];

export const NormalizeTexts: { text: string; normalized: string }[] = [
  { text: "   ab#*c   d  efg/hi   ", normalized: "abc d efghi" },
  { text: "#/*^-_", normalized: "" },
  { text: ".[txt]", normalized: "txt" },
  { text: "     ", normalized: "" },
  { text: ".", normalized: "" },
  { text: "[Netty]", normalized: "Netty" },
  { text: "abcd wef \n mno   pqr  ", normalized: "abcd wef mno pqr" },
];

export const DiffToLineSamples: {
  diffs: DiffComponents[];
  lines: DiffComponents[][];
}[] = [
  {
    diffs: [
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value: "The ",
      },
      {
        diffComponent: "added",
        belongsTo: BelongsIndicator.MODIFIED,
        value: "[Netty]",
      },
      {
        diffComponent: null,
        belongsTo: BelongsIndicator.BOTH,
        value:
          ' Project licenses this file to you under the Apache License,\n * version 2.0 (the "License"); you may not use this file except in compliance\n * with the License. You may obtain a copy of the License at:\n *\n *   https://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT\n * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the\n * License for the specific language governing permissions and limitations\n * under the License.',
      },
    ],
    lines: [
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: "The ",
        },
        {
          diffComponent: "added",
          belongsTo: BelongsIndicator.MODIFIED,
          value: "[Netty]",
        },
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: " Project licenses this file to you under the Apache License,",
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value:
            ' * version 2.0 (the "License"); you may not use this file except in compliance',
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value:
            " * with the License. You may obtain a copy of the License at:",
        },
      ],
      [
        {
          value: " *",
          belongsTo: BelongsIndicator.BOTH,
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: " *   https://www.apache.org/licenses/LICENSE-2.0",
        },
      ],
      [
        {
          value: " *",
          belongsTo: BelongsIndicator.BOTH,
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value:
            " * Unless required by applicable law or agreed to in writing, software",
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value:
            ' * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT',
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value:
            " * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the",
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value:
            " * License for the specific language governing permissions and limitations",
        },
      ],
      [
        {
          diffComponent: null,
          belongsTo: BelongsIndicator.BOTH,
          value: " * under the License.",
        },
      ],
    ],
  },
];
