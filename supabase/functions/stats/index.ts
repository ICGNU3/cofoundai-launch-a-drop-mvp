
/**
 * Supabase Edge Function to return stats ({ total, drops }) for the home hero
 * GET: returns { total, drops }
 * (uses the new get_stats() function/view)
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    // Supabase JS client is not available; call directly to PostgREST endpoint for views/functions.
    // It's safe because this is a public stat, not user data.
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    const url = `${supabaseUrl}/rest/v1/rpc/get_stats`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const error = await res.text();
      return new Response(JSON.stringify({ error }), { status: 500, headers: corsHeaders });
    }

    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length < 1) {
      return new Response(JSON.stringify({ total: 0, drops: 0 }), { headers: corsHeaders });
    }
    const { total_streamed, total_drops } = arr[0];
    return new Response(JSON.stringify({ total: Number(total_streamed) || 0, drops: Number(total_drops) || 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
