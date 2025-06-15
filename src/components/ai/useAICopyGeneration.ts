
import { useToast } from "@/hooks/use-toast";

const SUPABASE_EDGE_FN_URL = "https://mwopsiduetlwehpcrkzg.functions.supabase.co/generate-content-ai";

export function useAICopyGeneration() {
  const { toast } = useToast();

  const fetchAIContent = async (prompt: string, model = "gpt-4o-mini") => {
    try {
      // Always use the full Supabase edge function URL
      const res = await fetch(SUPABASE_EDGE_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });

      // If response is HTML, treat as error
      const text = await res.text();
      // Try to parse as JSON
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

