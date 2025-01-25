export interface Project {
    id: string; // Changed from number to string
    name: string;
    status: string;
    schools: number;
  }
  
  export interface Bid {
    id: string; // Changed from number to string
    provider: string;
    cost: string;
    coverage: string;
    aiScore: number;
  }
  
  export interface Milestone {
    id: string;
    title: string;
    status: string;
    verificationMethod: string;
    date: string;
    verifier: string;
  }
  
  export interface ProjectProgress {
    project: string;
    startDate: string;
    expectedCompletion: string;
    progress: number;
    milestones: Milestone[];
  }
  