from web3 import HTTPProvider, Web3

from backend.config import settings


class MantleRPCClient:
    def __init__(self, rpc_url: str | None = None) -> None:
        self.rpc_url: str = rpc_url or settings.mantle_rpc_url
        self.web3: Web3 = Web3(HTTPProvider(self.rpc_url))

    def is_connected(self) -> bool:
        return bool(self.web3.is_connected())

    def get_latest_block_number(self) -> int:
        return self.web3.eth.block_number

    def get_chain_id(self) -> int:
        return self.web3.eth.chain_id


def get_mantle_rpc_client() -> MantleRPCClient:
    return MantleRPCClient()
