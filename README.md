# Mantle Atlas

Mantle Atlas is a backend-first ecosystem intelligence engine for the Mantle Network.

This repository contains a clean, modular Python backend focused on blockchain analytics infrastructure, data collection, and normalized data modeling. The current scope is limited to project architecture, backend structure, and data collectors.

## Tech Stack

- Python
- FastAPI
- Web3.py
- Requests
- Pydantic

## Project Structure

```/dev/null/tree.txt#L1-16
mantle-atlas/
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── data/
│   │   ├── mantle_rpc.py
│   │   ├── defillama.py
│   │   ├── coingecko.py
│   │   └── dexscreener.py
│   ├── models/
│   │   ├── protocol.py
│   │   ├── pool.py
│   │   └── token.py
│   └── utils/
│       └── http_client.py
├── requirements.txt
└── README.md
```

## Scope

This implementation focuses on:

- backend architecture
- modular data source clients
- normalized Pydantic models
- Mantle ecosystem data collection foundations

This implementation does not yet include:

- analytics algorithms
- scoring logic
- ranking systems
- frontend code
- advanced persistence layers

## Data Sources

All integrations use free public APIs.

### Mantle RPC
- Endpoint: `https://mantle-rpc.publicnode.com`
- Library: `Web3.py`
- Purpose: connect to Mantle and expose basic chain access through a dedicated client

### DeFiLlama Protocols
- Endpoint: `https://api.llama.fi/protocols`
- Purpose: fetch all protocols and filter those deployed on Mantle

### DeFiLlama Yields
- Endpoint: `https://yields.llama.fi/pools`
- Purpose: fetch all pools and filter pools where `chain == "Mantle"`

### CoinGecko
- Endpoint: `https://api.coingecko.com/api/v3/simple/price`
- Docs: `https://docs.coingecko.com/reference/simple-price`
- Purpose: fetch token prices

### DexScreener
- Docs: `https://docs.dexscreener.com/api/reference`
- Purpose: fetch liquidity pair data through a dedicated client

## Backend Design

The backend is organized by responsibility.

### `backend/main.py`
Owns the FastAPI application and exposes service endpoints.

### `backend/config.py`
Centralizes configuration such as API URLs, timeouts, and RPC settings.

### `backend/data/`
Contains one client per external data source:
- `mantle_rpc.py`
- `defillama.py`
- `coingecko.py`
- `dexscreener.py`

Each module exposes a simple public function:
- `get_mantle_protocols()`
- `get_mantle_pools()`
- `get_token_prices()`
- `get_liquidity_pairs()`

### `backend/models/`
Contains normalized Pydantic models:
- `Protocol`
- `Pool`
- `Token`

### `backend/utils/http_client.py`
Contains shared HTTP request logic for consistent API access and cleaner client modules.

## Performance Requirements

The backend is designed around linear-time processing.

Guidelines:
- all operations should remain `O(n)`
- use single-pass filtering where possible
- use dictionary lookups for fast access
- avoid nested loops across datasets

## Installation

Create a virtual environment and install dependencies.

```/dev/null/install.sh#L1-3
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

## Run

Start the backend with Uvicorn.

```/dev/null/run.sh#L1-1
uvicorn backend.main:app --reload
```

## Notes

- The codebase is intentionally modular to make future analytics layers easier to add.
- External API clients are isolated so each source can evolve independently.
- The initial version prioritizes clean infrastructure over advanced computation.

## Next Steps

Planned backend expansion can include:
- protocol enrichment
- pool-to-token normalization
- scheduled data collection
- caching
- database persistence
- analytics pipelines