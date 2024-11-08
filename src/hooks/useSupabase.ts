import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import toast from 'react-hot-toast';

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser(); // Check for an existing session on mount

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event); // Debugging log
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true); // Set loading before fetching profile
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    // Unsubscribe on cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Check if a user session exists on initial load
  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false); // No session, set loading to false
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false); // Ensure loading is false if there’s an error
    }
  }

  // Fetch user profile from `profiles` table or create default profile
  async function fetchUserProfile(userId: string) {
    try {
      console.log("Fetching user profile for:", userId); // Debugging log
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
        throw error;
      }

      setUser(profile || {
        id: userId,
        email: profile?.email || 'Unknown', // Adjust this if email isn't in profiles table
        name: profile?.name || 'User',
        role: profile?.role || 'user'
      });
      setLoading(false); // Set loading to false after fetching the profile
      console.log("User profile set:", profile); // Debugging log
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile');
      setLoading(false); // Ensure loading is false if there’s an error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error logging out');
      throw error;
    }
  };

  return { user, loading, login, logout };
}
