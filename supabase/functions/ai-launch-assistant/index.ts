
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, phase, previousResponses } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = getSystemPrompt(phase, previousResponses);

    const aiResult = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!aiResult.ok) {
      const errorBody = await aiResult.text();
      return new Response(
        JSON.stringify({ error: "OpenAI API error", details: errorBody }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await aiResult.json();
    const response = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    // Generate suggestions based on phase
    const suggestions = generateSuggestions(phase, message);

    return new Response(
      JSON.stringify({ 
        response,
        suggestions,
        shouldAdvancePhase: shouldAdvanceToNextPhase(message, phase)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getSystemPrompt(phase: string, previousResponses: any): string {
  const basePrompt = `You are an expert token launch consultant helping creators optimize their NFT/token launches. Be conversational, encouraging, and ask follow-up questions to gather more specific information.`;

  const phasePrompts: Record<string, string> = {
    goals: `${basePrompt} Focus on understanding their project goals, target audience size, and what success looks like to them. Ask about their creative medium, experience level, and primary objectives.`,
    content: `${basePrompt} Focus on their content strategy, existing audience, what exclusive value they can provide to token holders, and their content creation capabilities.`,
    strategy: `${basePrompt} Focus on their budget, timeline, marketing capabilities, and whether they want ongoing engagement or a one-time launch. Help them think about pricing strategy.`,
    recommendations: `${basePrompt} Synthesize all previous information to provide specific, actionable recommendations for token configuration, pricing, rewards structure, and launch strategy.`
  };

  return phasePrompts[phase] || basePrompt;
}

function generateSuggestions(phase: string, userMessage: string): string[] {
  const phaseSuggestions: Record<string, string[]> = {
    goals: ['Community Building', 'Project Funding', 'Revenue Generation', 'Fan Engagement'],
    content: ['Exclusive Art', 'Behind-the-Scenes', 'Early Access', 'Physical Merchandise', 'Virtual Events'],
    strategy: ['Limited Edition', 'Ongoing Series', 'Tiered Pricing', 'Community Voting', 'Utility Features'],
    recommendations: ['Apply Recommendations', 'Customize Further', 'Start Over']
  };

  return phaseSuggestions[phase] || [];
}

function shouldAdvanceToNextPhase(message: string, phase: string): boolean {
  // Simple heuristic - advance if user gives substantial response
  return message.length > 30 && !message.toLowerCase().includes('tell me more');
}
