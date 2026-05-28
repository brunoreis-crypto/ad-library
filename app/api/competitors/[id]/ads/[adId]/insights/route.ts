import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  req: Request,
  { params }: { params: { id: string; adId: string } },
) {
  const { creative_body, platforms } = await req.json()

  if (!creative_body) return NextResponse.json({ error: 'Sem texto criativo' }, { status: 400 })

  const prompt = `Você é um especialista em marketing de performance e criativos para anúncios pagos.

Analise o seguinte anúncio de um concorrente e forneça insights práticos.

Plataformas: ${(platforms ?? []).join(', ')}
Texto do anúncio: "${creative_body}"

Responda SOMENTE com JSON no seguinte formato (sem markdown, sem explicações):
{
  "what_works": "O que está funcionando neste anúncio (máximo 2 frases)",
  "angle": "Qual é o ângulo/hook principal utilizado (máximo 1 frase)",
  "adaptation_suggestion": "Como adaptar este ângulo para seus próprios criativos (máximo 2 frases)"
}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error('Anthropic API error')

    const data = await res.json()
    const text = data.content[0].text
    const insights = JSON.parse(text)

    await supabase
      .from('competitor_ads')
      .update({ ai_insights: JSON.stringify(insights) })
      .eq('id', params.adId)

    return NextResponse.json(insights)
  } catch {
    return NextResponse.json(
      {
        what_works: 'Não foi possível gerar insights automaticamente.',
        angle: 'Configure a variável ANTHROPIC_API_KEY para habilitar esta função.',
        adaptation_suggestion: 'Analise o copy manualmente e identifique o gatilho emocional principal.',
      },
    )
  }
}
