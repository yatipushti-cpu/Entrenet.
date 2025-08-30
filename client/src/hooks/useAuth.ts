import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const setUserTypeMutation = useMutation({
    mutationFn: async (userType: string) => {
      return await apiRequest('POST', '/api/user/select-type', { userType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      localStorage.removeItem('pendingUserType');
    },
  });

  // Check for pending user type after successful authentication
  useEffect(() => {
    if (user && !user.userType && !setUserTypeMutation.isPending) {
      const pendingUserType = localStorage.getItem('pendingUserType');
      if (pendingUserType && ['job_seeker', 'employer'].includes(pendingUserType)) {
        setUserTypeMutation.mutate(pendingUserType);
      }
    }
  }, [user?.id, user?.userType]); // Only depend on user ID and userType, not the mutation

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAuthError: !!error,
  };
}
