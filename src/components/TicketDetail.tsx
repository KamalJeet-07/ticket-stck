import React, { useState } from 'react';
import { Ticket, Comment, User } from '../types';
import { MessageSquare, Send } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  currentUser: User;
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  onAddComment: (ticketId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

export default function TicketDetail({
  ticket,
  currentUser,
  onUpdateTicket,
  onAddComment,
}: TicketDetailProps) {
  const [newComment, setNewComment] = useState('');

  const handleStatusChange = (status: Ticket['status']) => {
    onUpdateTicket(ticket.id, { status });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(ticket.id, {
        content: newComment,
        userId: currentUser.id,
      });
      setNewComment('');
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{ticket.title}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{ticket.description}</p>
        </div>
        
        {currentUser.role === 'admin' && (
          <div className="mt-5">
            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusChange('open')}
                className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                  ticket.status === 'open'
                    ? 'border-transparent text-white bg-red-600 hover:bg-red-700'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                  ticket.status === 'in-progress'
                    ? 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange('resolved')}
                className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                  ticket.status === 'resolved'
                    ? 'border-transparent text-white bg-green-600 hover:bg-green-700'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-start space-x-4">
            <div className="min-w-0 flex-1">
              <form onSubmit={handleSubmitComment}>
                <div className="border-b border-gray-200 focus-within:border-indigo-600">
                  <label htmlFor="comment" className="sr-only">
                    Add your comment
                  </label>
                  <textarea
                    rows={3}
                    name="comment"
                    id="comment"
                    className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 focus:border-indigo-600 focus:ring-0 sm:text-sm"
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Comments</h4>
          <div className="space-y-4">
            {ticket.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{comment.userId}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}