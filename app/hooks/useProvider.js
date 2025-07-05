const { useState, useEffect } = require("react");
const { useSDK } = require("@metamask/sdk-react");
const { ethers } = require("ethers");

/*
 * Provider:
 * A read-only connection to the blockchain.
 * Enables querying blockchain state, such as:
 *   - Accounts
 *   - Transaction details
 *   - Event logs
 */
export function useProvider() {

    const [provider, setProvider] = useState(null);
    const { sdk, chainId } = useSDK();

    // React hook to establish connection to the MetaMask provider
    useEffect(() => {
        if (sdk) {
            // a MetaMask-compatible EIP-1193 provider object that lets our DApp interact with the Ethereum blockchain
            const ethereum = sdk.getProvider();
            // wraps it in ethers.js
            const prov = new ethers.BrowserProvider(ethereum);
            setProvider(prov);
        }
    }, [sdk]); // Run when `sdk` loads or changes

    return { provider, chainId };

}
