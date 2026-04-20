import { getAllContentPlanItems, getContentPlanStats } from "@/lib/content-plan";
import ContentPlanClient from "./client";

export const dynamic = "force-dynamic";

export default async function ContentPlanPage() {
  const [items, stats] = await Promise.all([
    getAllContentPlanItems(),
    getContentPlanStats(),
  ]);

  return <ContentPlanClient items={items} stats={stats} />;
}
