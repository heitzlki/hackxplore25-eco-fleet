import client from "@/lib/openai";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: "Write a one-sentence bedtime story about a unicorn.",
  });

  return NextResponse.json(response);
}