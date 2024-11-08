import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Ticket } from '../types';
import toast from 'react-hot-toast';

export function useTickets(user: any) { // Accept user as a parameter
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTickets();
    } else {
      console.log("User is not authenticated, skipping fetch.");
      setLoading(false);
    }
  }, [user]);

  const fetchTickets = async () => {
    console.log("Starting fetchTickets...");
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          title,
          description,
          priority,
          status,
          created_at,
          user_id
        `) // Fetch fields without aliasing
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
        throw error;
      }

      // Map data to match the `Ticket` interface
      const mappedData = data?.map(ticket => ({
        ...ticket,
        createdAt: ticket.created_at, // Map created_at to createdAt
        userId: ticket.user_id,       // Map user_id to userId
      })) as Ticket[];

      console.log("Test fetch successful, mapped data:", mappedData);
      setTickets(mappedData);
    } catch (error) {
      toast.error('Error fetching tickets');
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
      console.log("Exiting fetchTickets, loading state set to false");
    }
  };

  const createTicket = async (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'comments'>) => {
    try {
      console.log("Creating ticket with data:", newTicket); // Log ticket data for debugging
      const { error } = await supabase
        .from('tickets')
        .insert([newTicket]);

      if (error) {
        console.error("Error details:", error); // Log error details
        throw error;
      }
      toast.success('Ticket created successfully');
    } catch (error) {
      toast.error('Error creating ticket');
      console.error('Error creating ticket:', error);
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      console.log("Updating ticket with ID:", ticketId, "with data:", updates); // Debugging log
      const { error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) {
        console.error("Error details:", error); // Log error details
        throw error;
      }
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Error updating ticket');
      console.error('Error updating ticket:', error);
    }
  };

  const addComment = async (ticketId: string, content: string, userId: string) => {
    try {
      const commentData = {
        ticket_id: ticketId,
        content,
        user_id: userId,
      };
      console.log("Adding comment with data:", commentData); // Debugging log

      const { error } = await supabase
        .from('comments')
        .insert([commentData]);

      if (error) {
        console.error("Error details:", error); // Log error details
        throw error;
      }
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Error adding comment');
      console.error('Error adding comment:', error);
    }
  };

  return {
    tickets,
    loading,
    createTicket,
    updateTicket,
    addComment,
  };
}
