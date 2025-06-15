
import { useToast } from "@/hooks/use-toast";

export function useAICopyGeneration() {
  const { toast } = useToast();

  const fetchAIContent = async (prompt: string, model = "gpt-4o-mini") => {
    try {
      const res = await fetch("/functions/v1/generate-content-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
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
