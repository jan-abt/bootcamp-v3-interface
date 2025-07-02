const { useState, useEffect } = require("react");
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers"



export function useProvider() {

    const [provider, setProvider] = useState(null)
    const { sdk, chainId } = useSDK()

    // React Hook to connect to an external system
    useEffect(() => {

        if (sdk) {
            const ethereum = sdk.getProvider()
            const p = new ethers.BrowserProvider(ethereum)
            setProvider(p)
        }

    }, [sdk]) // dependency: run whenever sdk loads/changes

    return { provider, chainId}
}