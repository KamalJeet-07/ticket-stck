export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
// types.ts
export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string; // or Date if you prefer
  userId: string;
  comments?: Comment[]; // Optional depending on your structure
}

export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  userId: string;
  createdAt: string; // or Date if you prefer
}
