import { NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { fileBase64, filename } = await req.json();

    // Dynamically load pdf-parse at runtime to avoid build-time evaluation
    // of its dependency @napi-rs/canvas which can fail in some environments
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfImport = require("pdf-parse");

    // The version 2.4.5 (mehmet-kozan) uses a class-based API
    const PDFParse = pdfImport.PDFParse || (typeof pdfImport === "function" ? pdfImport : pdfImport.default);

    if (!PDFParse || typeof PDFParse !== "function") {
      throw new Error(`Could not find PDFParse class. Type: ${typeof pdfImport}, Keys: ${Object.keys(pdfImport || {}).join(", ")}`);
    }

    const buffer = Buffer.from(fileBase64, "base64");
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy(); // Always destroy to free memory
    const rawText = data.text;

    console.log(`--- DEBUG: Sending ${rawText.length} chars to AI Server ---`);

    const aiResponse = await fetch("http://127.0.0.1:8000/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text: rawText }),
      // Set a 5-minute timeout for large/complex resumes
      signal: AbortSignal.timeout(300000)
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Server Error:", errorText);
      return NextResponse.json({ error: "AI Server error", details: errorText }, { status: 500 });
    }

    const parsed = await aiResponse.json();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO resumes (id, filename, parsed_json, created_at)
      VALUES (?, ?, ?, ?)
    `).run(id, filename, JSON.stringify(parsed), new Date().toISOString());

    return NextResponse.json({ id, parsed });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("FULL Upload Error:", error);
    return NextResponse.json({
      error: "Detailed Upload Error",
      message: error.message,
      stack: error.stack,
      cause: (error as any).cause
    }, { status: 500 });
  }
}
