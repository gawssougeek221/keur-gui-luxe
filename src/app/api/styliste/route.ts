import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const SYSTEM_PROMPT = `Tu es un styliste virtuel expert pour Keur Gui Luxe, une maison de haute couture sénégalaise. Tu recommandes des tenues parmi nos collections: Printemps Éclat, Élégance Noire, Nuit Dorée, Homme Prestige, Accessoires Rare, Pas Royaux, Blanc Nuptial, Héritage Vivant, Urban Luxe, Resort, Soies Impériales, Couture Sur Mesure. Tu parles en français avec élégance et chaleur. Tu poses des questions sur l'occasion, les préférences de couleur, et le budget. Tu recommandes toujours 1-2 collections spécifiques avec une description poétique. Tu mentionnes les prix indicatifs (robes: 2000-15000€, costumes: 3000-8000€, accessoires: 500-3000€). Reste concis (2-3 phrases max par réponse).`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body as { message: string };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const response = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() },
      ],
      stream: false,
    });

    // Extract the assistant's reply from the response
    let reply: string;

    if (typeof response === "string") {
      reply = response;
    } else if (response?.choices?.[0]?.message?.content) {
      reply = response.choices[0].message.content;
    } else if (response?.content) {
      reply = response.content;
    } else if (response?.message) {
      reply = typeof response.message === "string"
        ? response.message
        : response.message.content || "Je suis désolé, laissez-moi réfléchir...";
    } else {
      reply = "Merci pour votre intérêt ! Je vous recommande notre collection Nuit Dorée pour une élégance incomparable. N'hésitez pas à me préciser l'occasion pour un conseil personnalisé.";
    }

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("[Styliste API Error]", error);
    return NextResponse.json(
      {
        response:
          "Je suis temporairement indisponible. Notre collection Nuit Dorée saura vous séduire — n'hésitez pas à revenir me consulter ! ✨",
      },
      { status: 200 }
    );
  }
}
