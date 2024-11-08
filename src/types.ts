export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  userId: string;
  assignedTo?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}