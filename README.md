# 🌍 Mantle Atlas

**Mantle Atlas** is your ultimate data map and intelligence engine for the **Mantle Network**.  
If you want to know where the money is, which protocols are growing fastest, where the best yields are, or where liquidity is missing—this tool is built for you!

## 🤔 What does this project do?
Mantle Atlas is an application that automatically collects data from across the Mantle blockchain (using APIs like DeFiLlama and DexScreener) and presents it in a super simple, easy-to-understand dashboard. 

Whether you are a **regular user** looking for high APY, an **investor** tracking Total Value Locked (TVL) growth, or a **developer** looking for gaps in liquidity to build new protocols, Mantle Atlas does the heavy lifting for you by analyzing the entire ecosystem at a glance.

**Key Features:**
- **Ecosystem Overview:** See exactly how much value (TVL) is locked in Mantle and which apps are dominating.
- **Yield Opportunities:** Find the pools with the best returns out there.
- **Liquidity Gaps:** Discover tokens that have high trading volume but low liquidity (a perfect opportunity for developers to build new liquidity pools!).
- **Smart Insights:** Get automated plain-English summaries of what's happening on Mantle today.

---

## 🛠️ How to run it locally

The project is split into two parts: the **Backend** (which collects and crunches the data) and the **Frontend** (which displays the shiny dashboard to users).

### 1. Start the Backend (Python)
The backend is a fast API that gathers all the on-chain data.

```bash
cd backend

# Create a virtual environment to keep things clean
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install the required packages
pip install -r ../requirements.txt

# Run the server!
./run.sh
# (Or run manually: uvicorn main:app --reload --port 8000)
```
*The backend will be running at `http://127.0.0.1:8000`*

### 2. Start the Frontend (Next.js)
The frontend is the interactive website you see in your browser.

```bash
cd frontend

# Install the necessary packages
npm install  # (or `bun install` / `yarn install`)

# Run the website!
npm run dev  # (or `bun dev` / `yarn dev`)
```
*The frontend will be running at `http://localhost:3000`*

---

## 🔒 Security & Data
We ensure sensitive data (`.env` files) and heavy folders (like `node_modules` or Python's `venv`) are ignored via `.gitignore`, keeping the repository lightweight and secure. This makes the project clean and safe to fork or contribute to.

Built for the **Mantle Ecosystem**. 🚀