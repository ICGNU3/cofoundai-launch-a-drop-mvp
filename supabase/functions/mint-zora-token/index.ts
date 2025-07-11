
/**
 * Supabase Edge Function to mint a Zora V4 token.
 * Proxies requests securely to the Zora API with the ZORA_KEY.
 *
 * Expects a JSON body:
 * {
 *   chainId: number,
 *   name: string,
 *   symbol: string,
 *   totalSupply: number | string,
 *   uri: string,
 *   creatorAddress: string
 * }
 *
 * Returns: { tokenAddress: string, ... }
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const zoraKey = Deno.env.get("ZORA_KEY");
    if (!zoraKey) {
      return new Response("ZORA_KEY not set", { status: 500, headers: corsHeaders });
    }

    const body = await req.json();
    const res = await fetch("https://api.zora.co/v4/coins/testnet", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${zoraKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(`Zora mint failed: ${text}`, { status: 500, headers: corsHeaders });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(`Unexpected error: ${err}`, { status: 500, headers: corsHeaders });
  }
});
