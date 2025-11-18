export interface Section {
  id?: number; // Optional when creating
  course_id: number;
  title: string;
  description:string;
  order_index: number;
  created_at?: string; // Optional - returned from backend
  updated_at?: string; // Optional - returned from backend
}
