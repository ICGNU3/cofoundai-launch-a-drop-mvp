
import React from "react";
import { Rocket, Users, DollarSign, Zap, Coins, TrendingUp, Share2, Gift, BarChart3 } from "lucide-react";

const features = [
  {
    icon: (
      <div className="bg-gradient-to-br from-accent-start to-yellow rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Rocket className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Start With Zero Upfront",
    desc: "No big budgets required to launch—just your idea and a community.",
    status: "live"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-accent to-gold rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Users className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Anyone Can Back You",
    desc: "Collect support from friends, fans, or collaborators—even small amounts matter.",
    status: "live"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-accent to-gold rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <DollarSign className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Get Paid as You Build",
    desc: "Funds are split automatically as you and your team deliver.",
    status: "live"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Zap className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Instant Coin Launch",
    desc: "Deploy an ERC-20 on Zora and open a Uniswap V4 pool with one click. Your coin goes live in under a minute.",
    status: "coming-soon"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Coins className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "One-Tap Liquidity",
    desc: "Pick ETH or USDC to pair, press Seed, and receive an NFT recording your full liquidity position.",
    status: "coming-soon"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <TrendingUp className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Creator Royalties on Every Swap",
    desc: "A Royalty Hook streams a set slice of each trade straight to the creator's wallet in real time.",
    status: "live"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <DollarSign className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Supporter Yield",
    desc: "Liquidity providers earn pool fees. Rewards accumulate block-by-block with one-click claiming.",
    status: "live"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Share2 className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Farcaster Mini App",
    desc: "Casts display interactive price cards. Followers swap right inside their feed, boosting liquidity and social proof.",
    status: "coming-soon"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Gift className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Referral Casts",
    desc: "Share personalized swap links. When new wallets trade through your cast, you earn fee bonuses on-chain.",
    status: "coming-soon"
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <BarChart3 className="text-white w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Live Insights",
    desc: "Internal subgraph tracks volume, depth, and royalty flow 24/7. Charts refresh every few seconds.",
    status: "live"
  },
];

const LandingFeaturesSection: React.FC = () => (
  <section className="w-full py-10 px-4 grid gap-8">
    <h2 className="text-xl md:text-2xl font-headline font-bold text-center text-success mb-7 drop-shadow">
      Built for Everyone, Not Just Crypto Natives
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {features.map(({ icon, title, desc, status }) => (
        <div
          key={title}
          className="bg-card rounded-xl border-2 border-accent/30 px-4 md:px-5 py-6 md:py-8 flex flex-col items-center text-center shadow-card-elevated hover:scale-105 hover:border-gold transition mx-auto w-full max-w-sm relative"
        >
          {status === "coming-soon" && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Coming Soon
            </div>
          )}
          {status === "live" && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Live
            </div>
          )}
          {icon}
          <h3 className="font-bold text-base md:text-lg text-accent mb-1">{title}</h3>
          <p className="text-body-text text-sm md:text-[15px] font-sans">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default LandingFeaturesSection;
