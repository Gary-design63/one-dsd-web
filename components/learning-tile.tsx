import Image from "next/image";
import Link from "next/link";
import { AuthorityPill } from "@/components/ui";
import type { ContentItem } from "@/lib/content/types";
import styles from "./learning-tile.module.css";
import { ResourceRemove } from "@/components/resource-tools";

type LearningTileProps = {
  item: ContentItem;
  href?: string;
  presentation?: { imageSrc: string; imageAlt: string; summary: string };
  /** Signed-in consultant: show the small remove control on the tile. */
  owner?: boolean;
};

export function LearningTile({ item, presentation, href, owner = false }: LearningTileProps) {
  const titleId = `learning-title-${item.id}`;
  const hasImage = Boolean(presentation?.imageSrc);
  return <article data-learning-id={item.id} style={owner ? { position: "relative" } : undefined}>
    {owner ? <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}><ResourceRemove contentItemId={item.id} title={item.title} compact /></div> : null}
    <Link href={href ?? `/library/${item.id}`} className={`${styles.tile} ${hasImage ? "" : styles.textOnly}`} aria-labelledby={titleId}>
      {hasImage ? <div className={styles.media}>
        <Image src={presentation!.imageSrc} alt={presentation!.imageAlt} fill sizes="(max-width: 460px) 90vw, (max-width: 760px) 35vw, (max-width: 1000px) 42vw, 240px" style={{ objectFit: "contain" }} unoptimized />
      </div> : null}
      <div className={styles.copy}>
        <h3 id={titleId} className={styles.title}>{item.title}</h3>
        <p className={styles.summary}>{presentation?.summary || item.summary}</p>
        <div className={styles.meta}><AuthorityPill authority={item.authority} /><span className={styles.arrow} aria-hidden="true">→</span></div>
      </div>
    </Link>
  </article>;
}
