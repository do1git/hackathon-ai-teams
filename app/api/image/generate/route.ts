import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const BUCKET_NAME = "rpg-images";

function getSupabaseClient() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

function mimeToExt(mime: string): string {
    if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
    if (mime.includes("webp")) return "webp";
    return "png";
}

export async function POST(request: NextRequest) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "GOOGLE_API_KEY is not configured" },
            { status: 500 }
        );
    }

    let prompt: string;
    try {
        const body = await request.json();
        prompt = body.prompt;
    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    if (!prompt?.trim()) {
        return NextResponse.json(
            { error: "prompt is required" },
            { status: 400 }
        );
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
            config: {
                responseModalities: ["image", "text"],
            },
        });

        const parts = response?.candidates?.[0]?.content?.parts;
        if (!parts) {
            return NextResponse.json(
                { error: "No response from Gemini" },
                { status: 502 }
            );
        }

        for (const part of parts) {
            if (!part.inlineData) continue;

            const mimeType = part.inlineData.mimeType || "image/png";
            const base64Data = part.inlineData.data!;

            // Try uploading to Supabase Storage
            const supabase = getSupabaseClient();
            if (supabase) {
                const ext = mimeToExt(mimeType);
                const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
                const buffer = Buffer.from(base64Data, "base64");

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(fileName, buffer, {
                        contentType: mimeType,
                        cacheControl: "31536000",
                    });

                if (!uploadError) {
                    const { data: urlData } = supabase.storage
                        .from(BUCKET_NAME)
                        .getPublicUrl(fileName);

                    return NextResponse.json({
                        imageUrl: urlData.publicUrl,
                        mimeType,
                    });
                }

                console.error("Supabase upload error:", uploadError);
            }

            // Fallback: return base64 if Supabase is not configured or upload fails
            return NextResponse.json({
                imageBase64: base64Data,
                mimeType,
            });
        }

        return NextResponse.json(
            { error: "No image generated. The model may have refused due to safety filters." },
            { status: 422 }
        );
    } catch (error) {
        console.error("Image generation error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Image generation failed" },
            { status: 500 }
        );
    }
}
