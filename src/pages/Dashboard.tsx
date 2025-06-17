
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
import { StreamlinedWizardButton } from "@/components/StreamlinedWizardButton";
import ModernNavigation from "@/components/ModernNavigation";

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Royalties claimed successfully');
    } catch (error) {
      console.error('Failed to claim royalties:', error);
    } finally {
      setClaimLoading(false);
    }
  };

  const walletAddress = user?.wallet?.address || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-inter">
        <ModernNavigation />
        <div className="flex items-center justify-center pt-20">
          <div className="text-text font-light tracking-wide">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <ModernNavigation />
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
            <div>
              <h1 className="text-5xl lg:text-6xl font-light tracking-tighter text-text mb-2">
                Dashboard
              </h1>
              <p className="text-lg text-text/70 font-light tracking-wide">
                Manage your portfolio and trading activities
              </p>
            </div>
            <StreamlinedWizardButton 
              walletAddress={walletAddress}
              variant="default"
              size="default"
              className="bg-accent text-black hover:bg-accent/90 font-light tracking-wide px-8 py-3 text-base"
            >
              Launch New Drop
            </StreamlinedWizardButton>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="portfolio" className="space-y-8">
            <TabsList className="bg-card border border-border h-14 p-1 font-inter">
              <TabsTrigger 
                value="portfolio" 
                className="text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3 text-base"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="trading" 
                className="text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3 text-base"
              >
                Trading
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3 text-base"
              >
                Creator Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="positions" 
                className="text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3 text-base"
              >
                My Positions
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="text-text data-[state=active]:bg-accent data-[state=active]:text-black font-light tracking-wide px-6 py-3 text-base"
              >
                My Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-8">
              <PortfolioTab />
            </TabsContent>

            <TabsContent value="trading" className="mt-8">
              <TradingTab />
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <AnalyticsTab projects={projects} />
            </TabsContent>

            <TabsContent value="positions" className="mt-8">
              <PositionsTab 
                onClaim={handleClaim}
                isClaimLoading={claimLoading}
              />
            </TabsContent>

            <TabsContent value="projects" className="mt-8">
              <ProjectsTab projects={projects} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
