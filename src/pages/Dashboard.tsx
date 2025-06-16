
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioTab } from "@/components/dashboard/PortfolioTab";
import { TradingTab } from "@/components/dashboard/TradingTab";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { PositionsTab } from "@/components/dashboard/PositionsTab";
import { ProjectsTab } from "@/components/dashboard/ProjectsTab";

const Dashboard: React.FC = () => {
  const { user } = usePrivy();
  const [claimLoading, setClaimLoading] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["userProjects", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleClaim = async (positionId: string) => {
    setClaimLoading(true);
    try {
      console.log('Claiming royalties for position:', positionId);
      // Mock claim process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Royalties claimed successfully');
    } catch (error) {
      console.error('Failed to claim royalties:', error);
    } finally {
      setClaimLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-body-text">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-headline">Dashboard</h1>
          <Link
            to="/"
            className="px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition"
          >
            Launch New Drop
          </Link>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="portfolio" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="trading" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
              Trading
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
              Creator Analytics
            </TabsTrigger>
            <TabsTrigger value="positions" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
              My Positions
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
              My Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioTab />
          </TabsContent>

          <TabsContent value="trading">
            <TradingTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab projects={projects} />
          </TabsContent>

          <TabsContent value="positions">
            <PositionsTab 
              onClaim={handleClaim}
              isClaimLoading={claimLoading}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab projects={projects} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
