import { DsdInventoryMap } from "@/components/multimedia/dsd-inventory-map";
import styles from "@/components/dsd-experience.module.css";
import type { Metadata } from "next";
import { loadDsdInventory } from "@/lib/dsd/published";
import Link from "next/link";
import { OneDsdContextPanel } from "@/components/program-context";
import { PageIntro } from "@/components/ui";
import { WORK_AREAS } from "@/lib/product";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { areaFieldKey, linkListValue, stringListValue, stringValue } from "@/lib/content/staff-surface-registry";

export const metadata: Metadata = { title: "One DSD" };

const PROGRAM_DOORS = [
  {
    title: "Understand and learn",
    description: "Build from a welcoming introduction through intercultural practice, structural analysis, and lasting change.",
    href: "/learn",
    label: "Explore learning",
  },
  {
    title: "Apply the work",
    description: "Use questions, checklists, reviews, and working tools to shape a program, policy, service, meeting, or workforce decision.",
    href: "/practice",
    label: "Open Practice",
  },
  {
    title: "Prepare with community context",
    description: "Use reviewed, question-led material to plan access and engagement without treating group information as a label for a person.",
    href: "/minnesota-communities",
    label: "Explore Minnesota Communities",
  },
  {
    title: "Find support",
    description: "Work independently when that is enough, identify the responsible person, or ask for a DSD consultation when the work qualifies.",
    href: "/support",
    label: "Review support choices",
  },
] as const;

export default async function OneDsdPage() {
  const [surface, areasSurface, amplifySurface, teamSurface, inventorySurface, inventory] = await Promise.all([
    prepareEditableSurface("one-dsd.page"),
    prepareEditableSurface("areas.page", { includeOwner: false }),
    prepareEditableSurface("amplify.home", { includeOwner: false }),
    prepareEditableSurface("dsd-team.home", { includeOwner: false }),
    prepareEditableSurface("one-dsd.inventory"),
    loadDsdInventory(),
  ]);
  const copy = surface.values;
  const programs = inventory.filter(item => item.surfaceId.startsWith("dsd-program."));
  const scenarios = inventory.filter(item => item.surfaceId.startsWith("dsd-scenario."));
  // Published wording overrides the defaults field by field; a door is only rendered when it
  // has a heading and link wording, so an incomplete surface never produces a blank tile or an
  // unnamed link, and every door keeps the destination defined for it here.
  const doors = PROGRAM_DOORS.map((door, index) => ({
    ...door,
    title: stringValue(copy, `door${index}Title`) || door.title,
    description: stringValue(copy, `door${index}Description`) || door.description,
    label: stringValue(copy, `door${index}Label`) || door.label,
  })).filter((door) => door.title.trim() && door.label.trim());
  const routeLinks = linkListValue(copy, "routeLinks");
  return (
    <EditableSurfaceRegion surface={surface} className={styles.page}>
      <PageIntro
        kicker={stringValue(copy, "introKicker")}
        title={stringValue(copy, "introTitle")}
        lede={stringValue(copy, "introLede")}
      />
      <div className="wrap max-w-6xl space-y-10 py-10">
        <OneDsdContextPanel />
        <nav className={styles.sectionNav} aria-label="On this One DSD page">{(teamSurface.available || amplifySurface.available) && <a href="#people">People and connection</a>}{programs.length > 0 && <a href="#programs">Programs and services</a>}{scenarios.length > 0 && <a href="#scenarios">Practice situations</a>}<a href="#areas-title">Areas of work</a><a href="#consult-title">Support</a></nav>
        {teamSurface.available ? <section id="people" className={styles.communityDoor}>
          <h2 className="text-2xl font-semibold"><Link href="/one-dsd/team">{stringValue(teamSurface.values, "title")}</Link></h2>
          <p>{stringValue(teamSurface.values, "intro")}</p>
        </section> : null}
        {amplifySurface.available ? <section id={teamSurface.available ? undefined : "people"} className={styles.communityDoor}>
          <h2 className="text-2xl font-semibold"><Link href="/one-dsd/amplify">{stringValue(amplifySurface.values, "title")}</Link></h2>
          <p>{stringValue(amplifySurface.values, "intro")}</p>
        </section> : null}

        <section className="grid gap-x-12 gap-y-8 lg:grid-cols-2" aria-labelledby="relationship-title">
          <div className="border-t border-line pt-5">
            <p className="kicker">{stringValue(copy, "sharedKicker")}</p>
            <h2 id="relationship-title" className="text-2xl font-extrabold">{stringValue(copy, "sharedTitle")}</h2>
            <ul className="mt-3 list-disc pl-6">
              {stringListValue(copy, "sharedItems").map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="border-t border-line pt-5">
            <p className="kicker">{stringValue(copy, "dsdKicker")}</p>
            <h2 className="text-2xl font-extrabold">{stringValue(copy, "dsdTitle")}</h2>
            <ul className="mt-3 list-disc pl-6">
              {stringListValue(copy, "dsdItems").map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section aria-labelledby="use-title">
          <p className="kicker">{stringValue(copy, "useKicker")}</p>
          <h2 id="use-title" className="text-2xl font-extrabold">{stringValue(copy, "useTitle")}</h2>
          <ul className={`${styles.doorList} mt-4 grid list-none gap-x-12 gap-y-7 p-0 md:grid-cols-2`}>
            {doors.map((door) => (
              <li key={door.href} className="border-t border-line pt-4">
                <h3 className="text-xl font-extrabold">{door.title}</h3>
                <p>{door.description}</p>
                <Link href={door.href}>{door.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <EditableSurfaceRegion surface={inventorySurface} className="space-y-10">
          {programs.length ? <section id="programs" aria-labelledby="programs-title">
            <h2 id="programs-title" className="text-2xl font-extrabold">{stringValue(inventorySurface.values, "programsTitle")}</h2>
            <DsdInventoryMap programs={programs.map(program => ({ id: program.surfaceId.slice("dsd-program.".length), title: stringValue(program.values, "title") }))} /><ul className={`${styles.programList} mt-4 grid list-none gap-x-12 gap-y-8 p-0 md:grid-cols-2`}>
              {programs.map(program => <li key={program.surfaceId} className="border-t border-line pt-4">
                <h3 className="text-xl font-semibold"><Link href={"/one-dsd/programs/" + program.surfaceId.slice("dsd-program.".length)}>{stringValue(program.values, "title")}</Link></h3>
                <p>{stringValue(program.values, "intro")}</p>
                <h4 className="font-semibold">{stringValue(program.values, "entryPointsTitle")}</h4>
                <ul className="list-disc pl-6">{stringListValue(program.values, "equityEntryPoints").map((point, index) => <li key={index}>{point}</li>)}</ul>
              </li>)}
            </ul>
          </section> : null}
          {scenarios.length ? <section id="scenarios" aria-labelledby="scenarios-title">
            <h2 id="scenarios-title" className="text-2xl font-extrabold">{stringValue(inventorySurface.values, "scenariosTitle")}</h2>
            <ul className={`${styles.scenarioList} mt-4 grid list-none gap-x-12 gap-y-8 p-0 md:grid-cols-2`}>
              {scenarios.map(scenario => <li key={scenario.surfaceId} className="border-t border-line pt-4">
                <h3 className="text-xl font-semibold"><Link href={"/one-dsd/scenarios/" + scenario.surfaceId.slice("dsd-scenario.".length)}>{stringValue(scenario.values, "title")}</Link></h3>
                <p>{stringValue(scenario.values, "situation")}</p>
              </li>)}
            </ul>
          </section> : null}
        </EditableSurfaceRegion>

        <section className="border-t border-line pt-5" aria-labelledby="areas-title">
          <p className="kicker">{stringValue(copy, "areasKicker")}</p>
          <h2 id="areas-title" className="text-2xl font-extrabold">{stringValue(copy, "areasTitle")}</h2>
          <p>
            {stringValue(copy, "areasBody")}
          </p>
          <ol className="mt-3 grid gap-x-8 gap-y-2 pl-6 md:grid-cols-2">
            {areasSurface.available ? WORK_AREAS.map((area) => (
              <li key={area.id}>
                <Link href={`/areas#${area.id}`}>{stringValue(areasSurface.values, areaFieldKey(area.id, "label"))}</Link>
              </li>
            )) : null}
          </ol>
        </section>

        <section className="grid gap-x-12 gap-y-7 border-t border-line pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]" aria-labelledby="consult-title">
          <div>
            <p className="kicker">{stringValue(copy, "consultKicker")}</p>
            <h2 id="consult-title" className="text-2xl font-extrabold">{stringValue(copy, "consultTitle")}</h2>
            <p>
              {stringValue(copy, "consultBody")}
            </p>
            <p className="m-0">
              {stringValue(copy, "consultBoundary")}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-extrabold">{stringValue(copy, "routeTitle")}</h3>
            <div className="mt-4 grid gap-3">
              {routeLinks.map((link, index) => <Link href={link.href} className={index === 0 ? "btn btn--primary" : "btn btn--light"} key={link.href}>{link.label}</Link>)}
            </div>
          </div>
        </section>
      </div>
    </EditableSurfaceRegion>
  );
}

