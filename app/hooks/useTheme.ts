import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTheme, updateUserTheme } from '../apis/themeApi';
import { supabase } from '../credentials/supabaseClient';
import { AppDispatch, RootState } from '../store';
import { setTheme, setThemeLoading, ThemeMode } from '../store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mode, isLoading } = useSelector((state: RootState) => state.theme);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Load theme from backend on mount
  useEffect(() => {
    const loadTheme = async () => {
      dispatch(setThemeLoading(true));
      setLastSyncError(null);
      
      try {
        const { theme, error } = await getUserTheme();
        if (!error) {
          dispatch(setTheme(theme));
          console.log('Theme loaded from backend:', theme);
        } else {
          console.error('Error loading theme:', error);
          setLastSyncError(error);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setLastSyncError('Failed to load theme');
      } finally {
        dispatch(setThemeLoading(false));
      }
    };

    loadTheme();
  }, [dispatch]);

  // Set up real-time subscription for theme changes
  useEffect(() => {
    if (!userId) {
      console.log('No userId available for theme subscription');
      return;
    }

    console.log('Setting up real-time theme subscription for user:', userId);

    // Create a single channel for both tables
    const themeChannel = supabase
      .channel(`theme-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔔 Theme changed in profiles table:', payload);
          console.log('Payload new:', payload.new);
          console.log('Payload old:', payload.old);
          if (payload.new && payload.new.theme) {
            console.log('✅ Updating theme from profiles subscription:', payload.new.theme);
            dispatch(setTheme(payload.new.theme as ThemeMode));
          } else {
            console.log('❌ No theme found in payload.new');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'salons',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔔 Theme changed in salons table:', payload);
          console.log('Payload new:', payload.new);
          console.log('Payload old:', payload.old);
          if (payload.new && payload.new.theme) {
            console.log('✅ Updating theme from salons subscription:', payload.new.theme);
            dispatch(setTheme(payload.new.theme as ThemeMode));
          } else {
            console.log('❌ No theme found in payload.new');
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Theme subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to theme changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Theme subscription error');
        } else if (status === 'TIMED_OUT') {
          console.error('⏰ Theme subscription timed out');
        } else if (status === 'CLOSED') {
          console.log('🔒 Theme subscription closed');
        }
      });

    // Cleanup subscription
    return () => {
      console.log('🧹 Cleaning up theme subscription');
      supabase.removeChannel(themeChannel);
    };
  }, [userId, dispatch]);

  // Toggle theme and sync with backend
  const handleToggleTheme = async () => {
    const newTheme: ThemeMode = mode === 'light' ? 'dark' : 'light';
    
    // Update local state immediately for responsive UI
    dispatch(setTheme(newTheme));
    setLastSyncError(null);
    
    // Sync with backend
    try {
      const { success, error } = await updateUserTheme(newTheme);
      if (success) {
        console.log('Theme successfully synced to backend:', newTheme);
      } else {
        console.error('Failed to sync theme with backend:', error);
        setLastSyncError(error || 'Failed to sync theme');
        
        // Show user-friendly error message
        Alert.alert(
          'Sync Error',
          'Your theme preference was updated locally but failed to sync with the server. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error syncing theme:', error);
      setLastSyncError('Network error while syncing theme');
      
      Alert.alert(
        'Network Error',
        'Unable to sync theme preference. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    }
  };

  // Set specific theme and sync with backend
  const handleSetTheme = async (newTheme: ThemeMode) => {
    if (newTheme === mode) return;
    
    // Update local state immediately
    dispatch(setTheme(newTheme));
    setLastSyncError(null);
    
    // Sync with backend
    try {
      const { success, error } = await updateUserTheme(newTheme);
      if (success) {
        console.log('Theme successfully synced to backend:', newTheme);
      } else {
        console.error('Failed to sync theme with backend:', error);
        setLastSyncError(error || 'Failed to sync theme');
      }
    } catch (error) {
      console.error('Error syncing theme:', error);
      setLastSyncError('Network error while syncing theme');
    }
  };

  // Force refresh theme from backend
  const refreshTheme = async () => {
    dispatch(setThemeLoading(true));
    setLastSyncError(null);
    
    try {
      const { theme, error } = await getUserTheme();
      if (!error) {
        dispatch(setTheme(theme));
        console.log('Theme refreshed from backend:', theme);
      } else {
        console.error('Error refreshing theme:', error);
        setLastSyncError(error);
      }
    } catch (error) {
      console.error('Error refreshing theme:', error);
      setLastSyncError('Failed to refresh theme');
    } finally {
      dispatch(setThemeLoading(false));
    }
  };

  return {
    theme: mode,
    isLoading,
    lastSyncError,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
    refreshTheme,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  };
}; 