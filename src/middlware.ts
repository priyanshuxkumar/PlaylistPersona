import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10s'),
});

// Define which routes you want to rate limit
export const config = {
  matcher: '/api/:path*',
};

export default async function handler(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
 
  const { success } = await ratelimit.limit(
    ip
  );
  
  if (!success) {
		return NextResponse.json(
			{
				message: 'Too many requests, please try again later.',
			},
			{
				status: 429,
			}
		);
	};

  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", request.url));
}
