
import React from "react";

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-white">
          See How It Works
        </h2>
      </div>
      
      <div className="grid gap-12 max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Mint a Coin in seconds</h3>
            <p className="text-gray-300 leading-relaxed">
              Pick a name, set a royalty percentage, hit <strong>Deploy</strong>. NEPLUS's factory mints your ERC-20 on Zora and spins up a Uniswap V4 pool in the same transaction. Gas fee only; no extra set-up cost or code required.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Seed liquidity with one click</h3>
            <p className="text-gray-300 leading-relaxed">
              Choose how much ETH or USDC to pair. The app routes the add-liquidity call through Uniswap's Universal Router, deposits both tokens, and returns a single NFT that records your precise price range, fee tier, and liquidity size. This NFT proves ownership of the position and lets advanced hooks target it later for perks or boosts.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Share straight to Farcaster</h3>
            <p className="text-gray-300 leading-relaxed">
              Tap <strong>Cast to Feed</strong>. Your post renders an interactive card powered by the neplus-miniapp. Followers swap directly inside the thread, track live price and depth, and never leave their timeline. Every trade settles through the pool you just funded.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
              4
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Earn on every trade</h3>
            <p className="text-gray-300 leading-relaxed">
              A Creator Royalty Hook skims your chosen royalty slice from each swap and streams it to your wallet in real time. Liquidity providers collect the remaining fee flow. Open <strong>Royalties</strong> any time to claim earnings or watch the counter climb as volume builds.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <p className="text-xl text-gray-300 font-light">
          Four steps—mint, seed, share, earn. The market runs on autopilot while you focus on building, creating, and growing your community.
        </p>
      </div>
    </section>
  );
};

export default HowItWorksSection;
