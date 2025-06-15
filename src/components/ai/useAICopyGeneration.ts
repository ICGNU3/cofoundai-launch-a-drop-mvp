
import { useToast } from "@/hooks/use-toast";

// Use the full supabase edge function URL
const SUPABASE_EDGE_FN_URL = "https://mwopsiduetlwehpcrkzg.functions.supabase.co/generate-content-ai";

// Get the anon key from the environment (Vite injects it at build time)
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useAICopyGeneration() {
  const { toast } = useToast();

  const fetchAIContent = async (prompt: string, model = "gpt-4o-mini") => {
    try {
      // Send the authorization header!
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (SUPABASE_ANON_KEY) {
        headers["authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
      }

      const res = await fetch(SUPABASE_EDGE_FN_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt, model }),
      });

      // If response is HTML, treat as error
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Edge function did not return valid JSON. Check deployment and function logs.");
      }

      console.log("[AICopyGeneration] Edge function response:", data);
      if (data.generated) return data.generated;
      if (data.error) {
        console.error("[AICopyGeneration] AI error:", data.error, data.details || "");
        toast({
          title: "AI Generation Failed",
          description: data.error + (data.details ? ` (${data.details})` : ""),
          variant: "destructive",
        });
      }
      return null;
    } catch (err: any) {
      toast({
        title: "AI Error",
        description: err?.message || "Failed to generate content.",
        variant: "destructive",
      });
      console.error("[AICopyGeneration] Exception:", err);
      return null;
    }
  };

  return { fetchAIContent };
}
