import { NextResponse } from 'next/server'
import type { Ad } from '@/types'

interface AdDiagnosis {
  ad_id: string
  status: 'otimo' | 'bom' | 'atencao' | 'critico'
  score: number
  problema_principal: string
  o_que_otimizar: string
  ponto_forte: string
}

function buildPrompt(ads: Ad[]): string {
  const adsText = ads.map(ad => `
AD: ${ad.ad_name}
Campanha: ${ad.campaign_name}
Gasto: R$ ${ad.spend.toFixed(2)} | Impressões: ${ad.impressions.toLocaleString('pt-BR')} | Cliques: ${ad.clicks.toLocaleString('pt-BR')}
CTR: ${ad.ctr.toFixed(2)}% | CPL: ${ad.cpl ? `R$ ${ad.cpl.toFixed(2)}` : 'N/A'} | CPC: ${ad.cpc ? `R$ ${ad.cpc.toFixed(2)}` : 'N/A'} | CPM: ${ad.cpm ? `R$ ${ad.cpm.toFixed(2)}` : 'N/A'}
ROAS: ${ad.roas ? `${ad.roas.toFixed(1)}x` : 'N/A'} | Frequência: ${ad.frequency ? ad.frequency.toFixed(2) : 'N/A'} | Alcance: ${ad.reach ? ad.reach.toLocaleString('pt-BR') : 'N/A'}
ID: ${ad.id}`).join('\n---\n')

  return `Você é um especialista em performance marketing digital, com foco em Meta Ads Brasil.

Analise os seguintes anúncios e retorne um diagnóstico para cada um.

Benchmarks Meta Ads Brasil 2024:
- CTR: < 0.8% = crítico | 0.8-1.5% = atenção | 1.5-2.5% = bom | > 2.5% = ótimo
- CPM: > R$ 25 = crítico | R$ 15-25 = atenção | R$ 8-15 = bom | < R$ 8 = ótimo
- Frequência: > 5 = crítico | 3-5 = atenção | 2-3 = bom | < 2 = ótimo
- ROAS (se disponível): < 2x = crítico | 2-4x = atenção | 4-7x = bom | > 7x = ótimo

ANÚNCIOS:
${adsText}

Responda SOMENTE com um array JSON (sem markdown, sem texto antes ou depois):
[
  {
    "ad_id": "id do anúncio",
    "status": "otimo" | "bom" | "atencao" | "critico",
    "score": número de 1 a 10,
    "problema_principal": "problema em até 5 palavras",
    "o_que_otimizar": "ação específica e prática em 1-2 frases",
    "ponto_forte": "ponto positivo em até 5 palavras"
  }
]`
}

export async function POST(req: Request) {
  const { ads } = await req.json() as { ads: Ad[] }
  if (!ads?.length) return NextResponse.json({ error: 'Sem anúncios' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      ads.map(ad => mockDiagnosis(ad)),
    )
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: buildPrompt(ads) }],
      }),
    })

    const data = await res.json()
    const text = data.content[0].text
    const diagnoses: AdDiagnosis[] = JSON.parse(text)
    return NextResponse.json(diagnoses)
  } catch {
    return NextResponse.json(ads.map(ad => mockDiagnosis(ad)))
  }
}

function mockDiagnosis(ad: Ad): AdDiagnosis {
  const score = Math.min(10, Math.max(1,
    (ad.ctr >= 2.5 ? 3 : ad.ctr >= 1.5 ? 2 : ad.ctr >= 0.8 ? 1 : 0) +
    ((ad.cpm ?? 20) < 8 ? 3 : (ad.cpm ?? 20) < 15 ? 2 : (ad.cpm ?? 20) < 25 ? 1 : 0) +
    ((ad.roas ?? 0) > 7 ? 4 : (ad.roas ?? 0) > 4 ? 3 : (ad.roas ?? 0) > 2 ? 2 : 1),
  ))
  const status: AdDiagnosis['status'] = score >= 8 ? 'otimo' : score >= 6 ? 'bom' : score >= 4 ? 'atencao' : 'critico'
  return {
    ad_id: ad.id,
    status,
    score,
    problema_principal: ad.ctr < 1.5 ? 'CTR abaixo do ideal' : (ad.cpm ?? 0) > 20 ? 'CPM elevado' : 'Frequência alta',
    o_que_otimizar: ad.ctr < 1.5
      ? 'Testar novos criativos com hooks mais diretos. O CTR indica que o anúncio não está gerando curiosidade suficiente.'
      : 'Revisar a segmentação do público para reduzir o CPM e aumentar a eficiência do investimento.',
    ponto_forte: (ad.roas ?? 0) > 4 ? 'ROAS excelente' : ad.clicks > 5000 ? 'Alto volume de cliques' : 'Boa cobertura de alcance',
  }
}
