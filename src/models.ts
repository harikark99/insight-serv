export interface Project {
    id: number;
    project_name: string;
  }
  
  export interface Task {
    id?: number;
    project_id: number;
    description: string;
  }
  