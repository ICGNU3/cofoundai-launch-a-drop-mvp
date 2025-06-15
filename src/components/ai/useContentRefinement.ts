
import { useToast } from "@/hooks/use-toast";

export function useContentRefinement() {
  const { toast } = useToast();
  
  const fetchAIContent = async (prompt: string, model = "gpt-4o-mini") => {
    try {
      const res = await fetch("/functions/v1/generate-content-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (data.generated) return data.generated;
      throw new Error(data.error || "AI generation failed");
    } catch (err: any) {
      toast({
        title: "AI Error",
        description: err?.message || "Failed to generate content.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { fetchAIContent };
}
