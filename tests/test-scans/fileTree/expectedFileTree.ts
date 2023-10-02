import { FileDataNode } from "../../../src/services/workbenchDB";

export const FileTreeSamples: {
  jsonFileName: string;
  flatData: {
    id: number;
    path: string;
    parent: string;
    name: string;
    type: string;
  }[];
  fileTree: FileDataNode[];
}[] = [
  {
    jsonFileName: "sample.json",
    flatData: [
      {
        id: 0,
        path: "manifests",
        parent: "#",
        name: null,
        type: "directory",
      },
      {
        id: 1,
        path: "manifests/copyright",
        parent: "manifests",
        name: null,
        type: "file",
      },
      {
        id: 2,
        path: "manifests/folder1",
        parent: "manifests",
        name: null,
        type: "directory",
      },
      {
        id: 3,
        path: "manifests/folder1/file1.txt",
        parent: "manifests/folder1",
        name: null,
        type: "file",
      },
      {
        id: 4,
        path: "manifests/folder1/folder2",
        parent: "manifests/folder1",
        name: null,
        type: "directory",
      },
      {
        id: 5,
        path: "manifests/folder1/folder2/file2.json",
        parent: "manifests/folder1/folder2",
        name: null,
        type: "file",
      },
      {
        id: 6,
        path: "manifests/folder3",
        parent: "manifests",
        name: null,
        type: "directory",
      },
      {
        id: 7,
        path: "manifests/folder3/file3.md",
        parent: "manifests/folder3",
        name: null,
        type: "file",
      },
      {
        id: 8,
        path: "manifests/GoogleCloudAnalytics.podspec.json",
        parent: "manifests",
        name: null,
        type: "file",
      },
    ],
    fileTree: [
      {
        id: 0,
        key: "manifests",
        title: "manifests",
        path: "manifests",
        parent: "#",
        name: null,
        type: "directory",
        isLeaf: false,
        children: [
          {
            id: 2,
            key: "manifests/folder1",
            title: "folder1",
            path: "manifests/folder1",
            parent: "manifests",
            name: null,
            type: "directory",
            isLeaf: false,
            children: [
              {
                id: 4,
                key: "manifests/folder1/folder2",
                title: "folder2",
                path: "manifests/folder1/folder2",
                parent: "manifests/folder1",
                name: null,
                type: "directory",
                isLeaf: false,
                children: [
                  {
                    id: 5,
                    key: "manifests/folder1/folder2/file2.json",
                    title: "file2.json",
                    path: "manifests/folder1/folder2/file2.json",
                    parent: "manifests/folder1/folder2",
                    name: null,
                    type: "file",
                    isLeaf: true,
                  },
                ],
              },
              {
                id: 3,
                key: "manifests/folder1/file1.txt",
                title: "file1.txt",
                path: "manifests/folder1/file1.txt",
                parent: "manifests/folder1",
                name: null,
                type: "file",
                isLeaf: true,
              },
            ],
          },
          {
            id: 6,
            key: "manifests/folder3",
            title: "folder3",
            path: "manifests/folder3",
            parent: "manifests",
            name: null,
            type: "directory",
            isLeaf: false,
            children: [
              {
                id: 7,
                key: "manifests/folder3/file3.md",
                title: "file3.md",
                path: "manifests/folder3/file3.md",
                parent: "manifests/folder3",
                name: null,
                type: "file",
                isLeaf: true,
              },
            ],
          },
          {
            id: 1,
            key: "manifests/copyright",
            title: "copyright",
            path: "manifests/copyright",
            parent: "manifests",
            name: null,
            type: "file",
            isLeaf: true,
          },
          {
            id: 8,
            key: "manifests/GoogleCloudAnalytics.podspec.json",
            title: "GoogleCloudAnalytics.podspec.json",
            path: "manifests/GoogleCloudAnalytics.podspec.json",
            parent: "manifests",
            name: null,
            type: "file",
            isLeaf: true,
          },
        ],
      },
    ],
  },
  {
    jsonFileName: "singledir.json",
    flatData: [
      {
        id: 0,
        path: "manifests",
        parent: "#",
        name: null,
        type: "directory",
      },
    ],
    fileTree: [
      {
        id: 0,
        key: "manifests",
        title: "manifests",
        path: "manifests",
        parent: "#",
        name: null,
        type: "directory",
        isLeaf: false,
        children: [],
      },
    ],
  },
  {
    jsonFileName: "singlefile.json",
    flatData: [
      {
        id: 0,
        path: "copyright.txt",
        parent: "#",
        name: null,
        type: "file",
      },
    ],
    fileTree: [
      {
        id: 0,
        key: "copyright.txt",
        title: "copyright.txt",
        path: "copyright.txt",
        parent: "#",
        name: null,
        type: "file",
        isLeaf: true,
      },
    ],
  },
  {
    jsonFileName: "empty.json",
    flatData: [],
    fileTree: [],
  },
];
