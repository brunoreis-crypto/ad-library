import { NextResponse } from 'next/server'
import { getLongLivedToken } from '@/lib/meta-api'

export async function POST(req: Request) {
  const { short_token } = await req.json()
  if (!short_token) return NextResponse.json({ error: 'short_token obrigatório' }, { status: 400 })

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) return NextResponse.json({ error: 'META_APP_ID e META_APP_SECRET não configurados' }, { status: 500 })

  try {
    const result = await getLongLivedToken(short_token, appId, appSecret)
    return NextResponse.json({ access_token: result.access_token })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erro ao trocar token' }, { status: 500 })
  }
}
