import client from "@/lib/openai";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

  const response = await client.responses.create({
    model: "claude-3-5-sonnet",
    input: "Write a one-sentence bedtime story about a unicorn.",
  });

  return NextResponse.json(response);

}