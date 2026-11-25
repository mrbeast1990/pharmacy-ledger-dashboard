import { supabase } from "@/integrations/supabase/client";

export type OwnerAccess = "anonymous" | "unauthorized" | "authorized";

/** يتحقق من الجلسة ثم من عضوية المستخدم في app_owner عبر الدالة الموجودة. */
export async function checkOwnerAccess(): Promise<OwnerAccess> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return "anonymous";

  const { data: isOwner, error: ownerError } = await supabase.rpc("is_owner");
  if (ownerError || isOwner !== true) return "unauthorized";

  return "authorized";
}
