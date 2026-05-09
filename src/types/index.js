/**
 * @typedef {Object} Vault
 * @property {string} pubkey
 * @property {string} name
 * @property {string} token
 * @property {string} depositToken
 * @property {number} apy
 * @property {number} tvl
 * @property {'low'|'medium'|'high'} riskLevel
 * @property {string} [description]
 */

/**
 * @typedef {Object} Position
 * @property {string} id
 * @property {string} walletAddress
 * @property {string} vaultPubkey
 * @property {string} vaultName
 * @property {number} depositedAmount
 * @property {string} depositedToken
 * @property {number} [sharesReceived]
 * @property {number} entryApy
 * @property {number} currentValue
 * @property {number} earned
 * @property {string} txHash
 * @property {string} sourceChain
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} walletAddress
 * @property {'bridge'|'swap'|'deposit'|'withdraw'} type
 * @property {'pending'|'confirming'|'confirmed'|'failed'} status
 * @property {number} amount
 * @property {string} token
 * @property {string} [fromChain]
 * @property {string} [toChain]
 * @property {string} [txHash]
 * @property {Object} [metadata]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Token
 * @property {string} symbol
 * @property {string} name
 * @property {number} decimals
 * @property {string} [mint]
 * @property {string} [logoUrl]
 */

/**
 * @typedef {Object} Chain
 * @property {string} id
 * @property {string} name
 * @property {number} chainId
 * @property {string} icon
 * @property {string} explorerUrl
 */

/**
 * @typedef {Object} BridgeQuote
 * @property {string} fromChain
 * @property {string} toChain
 * @property {string} fromToken
 * @property {string} toToken
 * @property {number} fromAmount
 * @property {number} toAmount
 * @property {number} estimatedTime
 * @property {number} bridgeFee
 * @property {number} networkFee
 * @property {number} [platformFee]
 * @property {number} [platformFeeBps]
 * @property {Array<BridgeStep>} steps
 * @property {string} route
 */

/**
 * @typedef {Object} BridgeStep
 * @property {string} type
 * @property {string} description
 * @property {number} estimatedTime
 * @property {string} [protocol]
 */

export {};
