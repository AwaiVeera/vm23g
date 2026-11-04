import { bindings } from './runtime';

export type ChatTurn = { role: 'system' | 'user' | 'assistant'; content: string };

const model = () => (bindings.AI_MODEL ?? '@cf/meta/llama-3.3-70b-instruct-fp8-fast') as keyof AiModels;

export const aiAvailable = () => Boolean(bindings.AI);

const sse = (text: string) => `data: ${JSON.stringify({ response: text })}\n\n`;

export function streamText(text: string, done?: (full: string) => void) {
  const tokens = text.match(/\S+\s*|\n/g) ?? [text];
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const t of tokens) {
        controller.enqueue(encoder.encode(sse(t)));
        await new Promise((r) => setTimeout(r, 14));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
      done?.(text);
    },
  });
}

export async function chatStream(messages: ChatTurn[], fallback: string, done: (full: string) => void) {
  if (!bindings.AI) return streamText(fallback, done);
  try {
    const upstream = (await bindings.AI.run(model(), {
      messages,
      stream: true,
      max_tokens: 420,
      temperature: 0.35,
    } as never)) as unknown as ReadableStream<Uint8Array>;
    let full = '';
    const decoder = new TextDecoder();
    let buffer = '';
    const tap = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        controller.enqueue(chunk);
        buffer += decoder.decode(chunk, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data) as { response?: string };
            if (parsed.response) full += parsed.response;
          } catch {}
        }
      },
      flush() {
        done(full.trim() || fallback);
      },
    });
    return upstream.pipeThrough(tap);
  } catch {
    return streamText(fallback, done);
  }
}

async function complete(messages: ChatTurn[], maxTokens = 500) {
  if (!bindings.AI) return null;
  try {
    const out = (await bindings.AI.run(model(), { messages, max_tokens: maxTokens, temperature: 0.2 } as never)) as {
      response?: string;
    };
    return out.response?.trim() ?? null;
  } catch {
    return null;
  }
}

export type EnquiryLike = {
  name: string;
  company?: string | null;
  pillars: string[];
  stage?: string | null;
  timeline?: string | null;
  budget?: string | null;
  message?: string | null;
  transcript?: string | null;
  chat?: string | null;
};

const describe = (e: EnquiryLike) =>
  [
    `Name: ${e.name}`,
    e.company && `Company: ${e.company}`,
    e.pillars.length && `Interested in: ${e.pillars.join(', ')}`,
    e.stage && `Stage: ${e.stage}`,
    e.timeline && `Timeline: ${e.timeline}`,
    e.budget && `Budget: ${e.budget}`,
    e.message && `Message: ${e.message}`,
    e.transcript && `Voice note transcript: ${e.transcript}`,
    e.chat && `Concierge chat:\n${e.chat}`,
  ]
    .filter(Boolean)
    .join('\n');

export type Insight = { summary: string; score: number; tags: string[] };

export function heuristicInsight(e: EnquiryLike): Insight {
  let score = 35;
  const text = `${e.message ?? ''} ${e.transcript ?? ''} ${e.chat ?? ''}`.toLowerCase();
  if (e.company) score += 10;
  if (e.budget && !/not sure|unsure/i.test(e.budget)) score += 15;
  if (e.timeline && /asap|month|weeks/i.test(e.timeline)) score += 10;
  if (text.length > 140) score += 10;
  if (e.transcript) score += 5;
  if (/urgent|launch|deadline|investor|scale/.test(text)) score += 10;
  score = Math.max(5, Math.min(95, score));
  const tags = [...e.pillars];
  if (/app|ios|android/.test(text)) tags.push('App');
  if (/website|site|web/.test(text)) tags.push('Website');
  if (/automation|ai|agent/.test(text)) tags.push('AI');
  if (/urgent|asap/.test(text) || /asap/i.test(e.timeline ?? '')) tags.push('Urgent');
  const first = (e.message || e.transcript || '').split(/(?<=[.!?])\s/)[0]?.slice(0, 160) ?? '';
  const summary = `${e.name}${e.company ? ` (${e.company})` : ''} — ${e.pillars.join(' + ') || 'general enquiry'}${
    e.timeline ? `, timeline ${e.timeline}` : ''
  }${e.budget ? `, budget ${e.budget}` : ''}. ${first}`.trim();
  return { summary, score, tags: [...new Set(tags)].slice(0, 6) };
}

export async function enquiryInsight(e: EnquiryLike): Promise<Insight> {
  const base = heuristicInsight(e);
  const raw = await complete(
    [
      {
        role: 'system',
        content:
          'You triage new business enquiries for VM23G, a Singapore group offering wellness (NavaFit Alignment) and brand/tech services (AaVisions). Reply with ONLY minified JSON: {"summary": string (max 40 words, factual, no invented details), "score": integer 1-100 (lead quality and readiness), "tags": string[] (max 5, short)}.',
      },
      { role: 'user', content: describe(e) },
    ],
    300,
  );
  if (!raw) return base;
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] ?? raw) as Partial<Insight>;
    return {
      summary: typeof parsed.summary === 'string' && parsed.summary ? parsed.summary.slice(0, 400) : base.summary,
      score: Number.isFinite(parsed.score) ? Math.max(1, Math.min(100, Math.round(Number(parsed.score)))) : base.score,
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 5) : base.tags,
    };
  } catch {
    return base;
  }
}

export async function draftReply(e: EnquiryLike, signer: string) {
  const ai = await complete(
    [
      {
        role: 'system',
        content: `Write a warm, concise first reply email (90-140 words) from ${signer} at VM23G to a new enquiry. Thank them, reflect their need in one sentence, propose a short discovery call, and ask one clarifying question. Do not promise prices, timelines or results. No subject line. Sign off with "${signer}, VM23G".`,
      },
      { role: 'user', content: describe(e) },
    ],
    420,
  );
  if (ai) return ai;
  const need = e.pillars.length ? e.pillars.join(' and ').toLowerCase() : 'your project';
  return `Hi ${e.name.split(' ')[0]},\n\nThank you for reaching out to VM23G — it's great to hear about ${need}${
    e.company ? ` at ${e.company}` : ''
  }.\n\nWe'd love to understand the goals behind it properly. Would you be open to a short discovery call this week? Let us know a couple of times that suit you.\n\nOne quick question before we speak: what would success look like for you three months from now?\n\nWarm regards,\n${signer}, VM23G`;
}

export async function transcribe(audio: ArrayBuffer) {
  if (!bindings.AI) return null;
  try {
    const bytes = new Uint8Array(audio);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    const out = (await bindings.AI.run((bindings.TRANSCRIBE_MODEL ?? '@cf/openai/whisper-large-v3-turbo') as keyof AiModels, {
      audio: btoa(binary),
    } as never)) as { text?: string };
    return out.text?.trim() || null;
  } catch {
    return null;
  }
}
