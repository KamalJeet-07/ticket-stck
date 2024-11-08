import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Ticket } from '../types';
import toast from 'react-hot-toast';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
    
    const subscription = supabase
      .channel('tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, 
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          comments (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      toast.error('Error fetching tickets');
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (newTicket: Omit<Ticket, 'id' | 'created_at' | 'comments'>) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .insert([newTicket]);

      if (error) throw error;
      toast.success('Ticket created successfully');
    } catch (error) {
      toast.error('Error creating ticket');
      console.error('Error creating ticket:', error);
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Error updating ticket');
      console.error('Error updating ticket:', error);
    }
  };

  const addComment = async (ticketId: string, content: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          ticket_id: ticketId,
          content,
          user_id: userId,
        }]);

      if (error) throw error;
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