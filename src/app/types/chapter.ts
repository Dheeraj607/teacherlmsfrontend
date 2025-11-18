export interface ChapterResource {
  id: number;
  resource_url: string;
  resourceType?: string; // optional, e.g., "pdf", "video"
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  video_url?: string;
  article_text?: string;
  quiz_data?: string;
  resource_url?: string;
  order_index: number;
  is_free_preview: boolean;
  duration: string;
  created_at: string;
  updated_at: string;
  section_id: number;
  course_id: number;
  content_type?: string[]; // ✅ make it an array
  resources?: ChapterResource[]; // ✅ add this
}
