module.exports = {
  defaultLang: 'en',
  testnet: {
    poolManagerAddress: 'cfxtest:xxxxtestnet',
    core: {
      name: 'Conflux Testnet',
      RPC: 'https://test.confluxrpc.com',
      networkId: 1,
    },
    eSpace: {
      name: 'Conflux eSpace (Testnet)',
      RPC: 'https://evmtestnet.confluxrpc.com',
      networkId: 71,
    },
  },
  mainnet: {
    poolManagerAddress: 'cfx:xxxxmainnet',
    poolAddress: 'cfx:acdh4uhdck553fzunxvw2y42snwa6gcmyyyw29h6y0',
    core: {
      name: 'Conflux Hydra',
      RPC: 'https://main.confluxrpc.com',
      networkId: 1029,
    },
    eSpace: {
      name: 'Conflux eSpace',
      RPC: 'https://evm.confluxrpc.com',
      networkId: 1030,
    },
  },
}
