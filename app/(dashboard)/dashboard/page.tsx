import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

/*
  Placeholder dashboard — replaced in Phase 3A with real KPI data and charts.
  For now it just confirms auth works: the session user is shown,
  and the page is unreachable without a valid session (middleware blocks it).
*/
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Badge color="mint">Dashboard</Badge>
        <h1 className="text-2xl font-black text-brand-black">
          Tableau de bord
        </h1>
      </div>

      <Card className="max-w-md">
        <p className="text-sm text-brand-gray italic mb-2">Session active</p>
        <p className="text-base font-bold text-brand-black">
          {session?.user.name ?? session?.user.email}
        </p>
        <p className="text-sm text-brand-dark-gray mt-1">
          Rôle :{" "}
          <span className="font-bold">
            {session?.user.role}
          </span>
        </p>
        <p className="text-xs text-brand-gray mt-4 italic">
          Les KPIs et graphiques arrivent en Phase 3A.
        </p>
      </Card>
    </div>
  );
}
