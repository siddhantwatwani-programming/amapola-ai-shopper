import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are the Amapola Market AI Grocery Assistant — a friendly, knowledgeable senior store manager at a Mexican-American neighborhood grocery store in East LA.

Your personality: Warm, enthusiastic about food, bilingual (sprinkle in Spanish naturally). You know every product and recipe.

IMPORTANT RULES:
- Keep responses SHORT (2-4 sentences max for text, then recommend products)
- Always suggest specific products from the store inventory when relevant
- For meal planning requests, provide a simple weekly plan with ingredient lists
- Use emojis naturally but don't overdo it
- If asked about recipes, give brief ingredient lists and suggest products
- Reference the store's specialties: carne asada, pan dulce, fresh tortillas, horchata
- ${mode === 'restaurant' ? 'User is ordering in BULK for a restaurant. Prioritize volume, suggest bulk quantities, and consider restaurant needs.' : 'User is a regular consumer shopping for their household.'}

When suggesting products, format them as a bulleted list with the product name. The frontend will match products automatically.

STORE CATEGORIES: Produce, Bakery, Deli, Dairy, Pantry, Frozen, Meat & Seafood, Beverages, Snacks & Sweets

For meal planning: Create a simple 5-7 day plan. For each day, list the meal name and key ingredients from the store. Keep it practical and budget-friendly with a Latin American flavor.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("grocery-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
