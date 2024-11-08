// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../hooks/useTickets';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import CreateTicket from './CreateTicket';
import { LogOut, Plus, TicketIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Ticket } from '../types';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { tickets, loading, createTicket, updateTicket, addComment } = useTickets(user); // Pass user here
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  useEffect(() => {
    if (!loading) {
      console.log("Tickets loaded:", tickets);
    }
  }, [loading, tickets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <span>User is not authenticated. Please login again.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TicketIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Ticket System</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.name} ({user?.role})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {showCreateTicket ? 'Create Ticket' : selectedTicket ? 'Ticket Details' : 'Tickets'}
            </h2>
            {!showCreateTicket && !selectedTicket && (
              <Button
                onClick={() => setShowCreateTicket(true)}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            )}
          </div>

          {showCreateTicket ? (
            <div>
              <CreateTicket
                onCreateTicket={(newTicket) => {
                  createTicket(newTicket); // Pass newTicket directly
                  setShowCreateTicket(false);
                }}
                userId={user?.id || ''}
              />
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateTicket(false)}
                >
                  Back to Tickets
                </Button>
              </div>
            </div>
          ) : selectedTicket ? (
            <div>
              <TicketDetail
                ticket={selectedTicket}
                currentUser={user!}
                onUpdateTicket={updateTicket}
                onAddComment={(ticketId, comment) => {
                  addComment(ticketId, comment.content, comment.userId);
                }}
              />
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTicket(null)}
                >
                  Back to Tickets
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <TicketList
                tickets={tickets}
                onSelectTicket={setSelectedTicket}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
