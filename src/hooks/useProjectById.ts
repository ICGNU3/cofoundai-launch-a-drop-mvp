
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

/**
 * Fetch a project row by its UUID id.
 */
export const useProjectById = (id?: string | null) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Tables<"projects"> | null;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });
};
