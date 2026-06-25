import type { APIRoute } from "astro";
import Anthropic from "@anthropic-ai/sdk";

export const prerender = false;

// __ANTHROPIC_KEY__ is injected by vite.define at dev/build time (local)
// process.env.ANTHROPIC_API_KEY is used on Vercel (set in dashboard)
declare const __ANTHROPIC_KEY__: string;

const SYSTEM_PROMPT = `You are a helpful assistant for the DDX Fortaleza 2026 programme - a Digital Guided Implant Surgery Immersion Program.

KEY PROGRAMME INFORMATION:
- Full name: Digital Guided Implant Surgery (DDX) Immersion Program - Fortaleza 2026
- Dates: 21-27 February 2027 (8 days)
- Location: CliniCare Training, Fortaleza, Ceara, Brazil
- Maximum participants: 12 (small groups, personalised attention)
- Language: Programme delivered in Spanish; materials also available in Portuguese

FACULTY / DIRECTORS:
- Dr. Juan Mendez - Programme Director. Specialist in implantology, Madrid, Spain. Expert in digital guided surgery 3D, immediate loading All-on-Four, GBR, periodontal plastic surgery. Former Director of CIDESID Barcelona 2000-2020.
- Dr. Manuel Gonzales - Programme Director. Specialist in digital guided implantology and advanced oral surgery.
- Prof. Assis Filipe - Brazil Coordinator. CTBMF-PhD, Fortaleza. Oral & Maxillofacial Surgeon, UFC. Expert in advanced OMFS, digital guided implantology, bone and soft tissue regeneration.

WHAT IS COVERED:
- Digital guided surgery 3D planning (EXocad, Exoplan software)
- Immediate loading protocols (All-on-Four, All-on-Six)
- Guided bone regeneration (GBR)
- Supervised surgeries on real patients at CliniCare Training (4 surgical sessions per day)
- Verification of planned vs executed results
- Periodontal plastic surgery

WHAT IS INCLUDED:
- Accommodation is included in the programme
- Airport transfers coordinated by the organisation
- Certificate of attendance issued jointly by DDX Fortaleza, CliniCare Training, and NACAR Clinicas Dentales

CANCELLATION POLICY:
- Cancellation more than 60 days before: 80% refund
- Cancellation within 60 days: option to transfer to a future edition

REGISTRATION & CONTACT:
- Contact: Eduardo Burger
- WhatsApp: +34 678 871 916
- Email: edu@digitaldentalxperts.com
- Registration form available on the website at /inscripcion (Spanish), /en/registration (English), /fr/inscription (French)
- Places are limited and assigned on a first-come, first-served basis

SUPPORTED BY:
- CliniCare Training (host facility, Fortaleza)
- Straumann Group
- NACAR Clinicas Dentales

INSTRUCTIONS FOR YOU:
- Always respond in the same language the user writes in (Spanish, English, or French)
- Be concise and helpful - answer directly
- For registration or pricing questions, always refer to Eduardo Burger on WhatsApp: +34 678 871 916
- If you don't know something specific (like exact pricing), say so and direct them to WhatsApp
- Be warm and professional - this is a premium surgical training programme
- Keep answers brief (2-4 sentences max unless more detail is genuinely needed)`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey =
      (typeof __ANTHROPIC_KEY__ !== "undefined" ? __ANTHROPIC_KEY__ : "") ||
      process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
      });
    }
    const client = new Anthropic({ apiKey });

    const body = await request.json();
    const { message, history = [] } = body as {
      message: string;
      history: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "No message provided" }), {
        status: 400,
      });
    }

    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...history.slice(-8),
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Chat API error:", err?.message || err);
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error" }),
      { status: 500 },
    );
  }
};
