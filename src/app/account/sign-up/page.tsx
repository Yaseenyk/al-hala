import { redirect } from "next/navigation";

/**
 * Auth is not built (see /account). Rather than ship a login form that accepts a password
 * and discards it — a lie, and a hazard the moment someone types a real password into it —
 * these routes redirect to the account page, which explains the situation honestly.
 */
export default function Page() {
  redirect("/account");
}
