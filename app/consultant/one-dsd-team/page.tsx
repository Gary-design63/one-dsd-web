import { redirect } from "next/navigation";

/** The One DSD Team space now lives on the public side of the program. */
export default function OneDsdTeamPage() {
  redirect("/one-dsd/team/workspace");
}
