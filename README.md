
# CoFound AI – Launch-a-Drop MVP

Turns any music, film, fashion, or art idea into a funded token economy in 60 seconds.<br>
Describe the project → set each collaborator’s cut → add fixed expenses → click **Mint & Fund**.<br>
The app mints a Zora Coins V4 creator-token, pins cover art to IPFS, locks funds on Base, and streams payouts when the work ships.

---

### Features

| Flow                  | What happens                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Idea → Crew & Cut** | Unlimited roles (Artist, Producer, DP, Gallery, etc.). Pills add / delete. Progress bar enforces 100 % split. |
| **Fixed Expenses**    | One-off costs—studio time, camera rentals, fabric orders—paid before revenue streams.                         |
| **Tokens**            | Zora Coins V4 on Base testnet. Collect page auto-listed on Zora.                                              |
| **Funding**           | Optional USDC pledge wraps to USDCx and locks in escrow.                                                      |
| **Auto-Pay**          | Superfluid CFA starts continuous streams to every wallet at “Mark Complete.”                                  |
| **Flex Badges**       | Zora Editions mint to contributors as on-chain proof of work.                                                 |
| **Dark UI**           | Satin-black background, Satoshi headings, Inter body, electric-purple accents.                                |

---

### Stack

Next.js 14 · Tailwind · Satoshi Variable · Inter · OpenAI GPT-4o · Anthropic Claude · Google Gemini  
Pinata IPFS · Zora Coins V4 SDK · Superfluid SDK · Base Testnet · Privy + Safe · Supabase

---

### Live demo

`https://cofoundai.com` → **Launch a Drop**  
(Testnet wallet required—Base Sepolia or Base Goerli.)

---

### Getting started (local)

```bash
git clone https://github.com/yourname/cofoundai.git
cd cofoundai
pnpm install
cp .env.example .env      # add keys below
pnpm dev                  # http://localhost:3000
```

#### Required environment vars

```
OPENAI_KEY=
ANTHROPIC_KEY=
GEMINI_KEY=
PINATA_JWT=
ZORA_AUTH=Bearer …
SUPERFLUID_KEY=
NEXT_PUBLIC_BASE_RPC=https://sepolia.base.org
```

---

### Folder map

```
/src
  /components   UI atoms, RolePill, ExpensePill, ProgressBar
  /lib          zoraCoin.ts, pinata.ts, superfluid.ts
  /pages        landing, wizard, result
  /styles       globals.css (dark theme)
```

---

### Running the flow

1. Connect a Base testnet wallet.
2. Type the project idea.
3. Add roles until the bar reads **Cuts balanced ✓**.
4. Add any fixed expenses.
5. Hit **Mint & Fund** – confirm both txs.
6. Share the Zora collect link.
7. Once the project is done, click **Mark Complete**.
8. Check wallets—streams run, Flex Badges appear.

---

### Roadmap

* Multi-model comparison view (GPT vs Claude vs Gemini).
* Public talent pool with on-chain reliability scores.
* Venture flow (equity / SAFE) via NEPLUS contracts.
* Mainnet launch on Base.

---

### License

MIT — do anything, give credit, no liability.

---

Built in 48 hours for **AI Showdown (Lovable)** and extended for **Bolt Hackathon + Zora Coinathon**.
