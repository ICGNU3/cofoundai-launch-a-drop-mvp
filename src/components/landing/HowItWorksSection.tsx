
import React from "react";

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-white">
          How it Works
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
            <h3 className="text-xl font-semibold text-white mb-3">Create your coin in seconds</h3>
            <p className="text-gray-300 leading-relaxed">
              Pick a name for your coin, choose how much you want to earn from trades, and hit <strong>Deploy</strong>. NEPLUS creates your digital coin and sets up a trading pool automatically. You only pay the network fee - no hidden costs or complicated setup required.
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
            <h3 className="text-xl font-semibold text-white mb-3">Add money to get trading started</h3>
            <p className="text-gray-300 leading-relaxed">
              Choose how much money you want to put in to kickstart trading. The app handles all the technical stuff behind the scenes and gives you a digital certificate that proves you own this investment. This certificate can unlock special perks and bonuses later.
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
            <h3 className="text-xl font-semibold text-white mb-3">Share with your community</h3>
            <p className="text-gray-300 leading-relaxed">
              Tap <strong>Share to Feed</strong> and your post becomes an interactive trading card. Your followers can buy and sell your coin right from their social feed, check live prices, and see trading activity - all without leaving the app. Every trade happens through the pool you just funded.
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
            <h3 className="text-xl font-semibold text-white mb-3">Earn money automatically</h3>
            <p className="text-gray-300 leading-relaxed">
              Every time someone trades your coin, you automatically earn a percentage that goes straight to your wallet. The more people trade, the more you earn. Check your <strong>Earnings</strong> section anytime to see how much you've made or watch your earnings grow in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <p className="text-xl text-gray-300 font-light">
          Four simple steps—create, fund, share, earn. Your coin trades automatically while you focus on building your community and growing your brand.
        </p>
      </div>
    </section>
  );
};

export default HowItWorksSection;
