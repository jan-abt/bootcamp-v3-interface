"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname} from "next/navigation"

// Import assets
import logo from "@/app/assets/logo.png"
import collapse from "@/app/assets/carets/collapse.svg"
import expand from "@/app/assets/carets/expand.svg"
import wallet from "@/app/assets/links/wallet.svg"
import trading from "@/app/assets/links/trading.svg"
import swap from "@/app/assets/links/swap.svg"
import loans from "@/app/assets/links/loans.svg"

function SideNav() {

    const path = usePathname()

    const links = [
        { href: "/wallet", label: "Wallet", image: wallet },
        { href: "/", label: "Trading", image: trading },
        { href: "/swap", label: "Swap", image: swap },
        { href: "/loans", label: "Loans", image: loans }
    ]

    return (
        <nav className="sidenav">
            <div className="logo">
                <Image src={logo} alt="logo" />
                <p>Dapp Exchange</p>
            </div>
            <button className="toggle">
                <Image src={collapse} alt="Collapse" />
            </button>
            <ul className="links">
                {links.map((link, indexKey) => (
                    <li key={indexKey}>
                        <Link href={link.href} className={`link ${path === link.href ? "link--active" : ""}`}>
                            <div className="label">
                                <div className="icon">
                                    <Image src={link.image} alt="trading" />
                                </div>
                                <span>
                                    {link.label}
                                </span>
                            </div>
                            <div className="arrow">
                                <Image src={expand} alt="expand" />
                            </div>
                        </Link>
                    </li>
                ))
                }
            </ul>
        </nav>
    );
}

export default SideNav;