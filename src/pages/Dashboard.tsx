
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import { Link } from "react-router-dom";
import { ProjectPreviewCard } from "@/components/ProjectPreviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SwapCard } from "@/components/SwapCard";
import { LiquidityDashboard } from "@/components/LiquidityDashboard";
import { CreatorAnalyticsDashboard } from "@/components/CreatorAnalyticsDashboard";
import { usePoolStats } from "@/hooks/usePoolStats";

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

  // Mock trending coins data - would come from API
  const mockTrendingCoins = [
    {
      id: '0x1234567890123456789012345678901234567890',
      symbol: 'MUSIC',
      name: 'Music Creator Coin',
      logoUrl: undefined
    },
    {
      id: '0x0987654321098765432109876543210987654321',
      symbol: 'ART',
      name: 'Digital Art Coin',
      logoUrl: undefined
    }
  ];

  // Mock liquidity positions
  const mockPositions = [
    {
      id: '1',
      coinSymbol: 'MUSIC',
      coinName: 'Music Creator Coin',
      liquidity: '1250.50',
      unclaimedRoyalties: '12.34',
      feeAPR: '8.5'
    },
    {
      id: '2',
      coinSymbol: 'ART',
      coinName: 'Digital Art Coin',
      liquidity: '890.25',
      unclaimedRoyalties: '5.67',
      feeAPR: '12.1'
    }
  ];

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

        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="trending" className="text-text data-[state=active]:bg-accent data-[state=active]:text-black">
              Trending
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

          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTrendingCoins.map((coin) => {
                // Mock pool stats for each coin
                const mockPoolStats = {
                  depth: '125000.50',
                  volume24h: '45000.25',
                  feeAPR: '8.5'
                };
                return (
                  <SwapCard 
                    key={coin.id}
                    coin={coin}
                    poolStats={mockPoolStats}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            {projects && projects.length > 0 ? (
              <div className="space-y-8">
                {projects
                  .filter(project => project.token_address)
                  .map((project) => (
                    <div key={project.id}>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold">{project.project_idea}</h3>
                        <p className="text-text/70 text-sm">Token: {project.token_address}</p>
                      </div>
                      <CreatorAnalyticsDashboard
                        tokenAddress={project.token_address!}
                        tokenSymbol={project.project_type || 'TOKEN'}
                        creatorAddress={project.wallet_address || user?.wallet?.address || ''}
                      />
                    </div>
                  ))
                }
                {projects.filter(project => project.token_address).length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-headline mb-4">No Analytics Available</h3>
                    <p className="text-body-text mb-6">Deploy a token to start tracking analytics!</p>
                    <Link
                      to="/"
                      className="inline-flex px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition"
                    >
                      Launch Your First Drop
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-headline mb-4">No Projects Yet</h3>
                <p className="text-body-text mb-6">Create your first project to start tracking analytics!</p>
                <Link
                  to="/"
                  className="inline-flex px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition"
                >
                  Launch Your First Drop
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="positions">
            <LiquidityDashboard 
              positions={mockPositions}
              onClaim={handleClaim}
              isClaimLoading={claimLoading}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectPreviewCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-headline mb-4">No projects yet</h3>
                <p className="text-body-text mb-6">Create your first project to get started!</p>
                <Link
                  to="/"
                  className="inline-flex px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition"
                >
                  Launch Your First Drop
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
