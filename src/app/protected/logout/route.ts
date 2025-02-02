import { logoutAction } from "@/app/actions";

export async function GET() {
  return await logoutAction();
}
