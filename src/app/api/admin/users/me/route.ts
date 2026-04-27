import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = !!((session as any)?.user?.role === "admin")
  return Response.json({ admin })
}
