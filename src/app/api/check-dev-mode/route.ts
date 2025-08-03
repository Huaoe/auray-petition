import { NextResponse } from 'next/server';
import { isDevelopment } from '@/lib/env-utils';

export async function GET() {
  return NextResponse.json({
    isDevelopment: isDevelopment(),
  });
}