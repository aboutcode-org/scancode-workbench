export interface DatasourceFilter {
  value: string;
  label: string;
}

export interface DepFilterTag {
  value: string;
  label: string;
  flag: "is_runtime" | "is_pinned" | "is_optional";
}

export const DepFilterTags: Record<
  "RUNTIME" | "PINNED" | "OPTIONAL",
  DepFilterTag
> = {
  RUNTIME: { value: "runtime", label: "Runtime", flag: "is_runtime" },
  PINNED: { value: "pinned", label: "Pinned", flag: "is_pinned" },
  OPTIONAL: { value: "optional", label: "Optional", flag: "is_optional" },
};
export const DepFilterTagsList = [
  DepFilterTags.RUNTIME,
  DepFilterTags.PINNED,
  DepFilterTags.OPTIONAL,
];
