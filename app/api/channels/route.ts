import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const { name, description } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
        .from('channels')
        .insert({
            name,
            description,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
