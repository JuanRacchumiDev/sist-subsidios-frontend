import { ChartSection } from "./ChartSection";
import { StatsGrid } from "./StatsGrid";

export const Dashboard = () => {
  return (
    <>
      <div className="space-y-6">
        <StatsGrid />
        <ChartSection />
      </div>
    </>
  );
};
