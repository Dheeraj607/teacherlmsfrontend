// types/chapter.ts
// types/chapter.ts
export interface ChapterResource {
  id: number;
  resource_url: string;
  resourceType?: string; // optional
}

export interface Chapter {
  id: number;
  title: string;
  order_index: number;
  video_url?: string;
  resources?: ChapterResource[]; // <-- add this
  // ...other fields
}
