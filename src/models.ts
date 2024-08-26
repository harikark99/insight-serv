export interface Project {
    id: number;
    project_name: string;
    tasks: string[];
}
  
export interface Task {
    id?: number;
    project_id: number;
    description: string;
}

export interface User {
    id: number;
    password: string;
    email: string;
}
  