import { Link } from "@tanstack/react-router";

export default function Footer() {
    return (
        <section className='flex flex-col items-center justify-center gap-14 py-32 border-t'>
            <nav className='container flex flex-col items-center gap-4'>
                <ul className='flex flex-wrap items-center justify-center gap-6'>
                    <li className=''>
                        <Link href="/" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={"/events"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Explore Events
                        </Link>
                    </li>
                    <li>
                        <Link to={"/about"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link to={"/faq" }className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            F.A.Q.
                        </Link>
                    </li>
                    <li>
                        <Link to={"/contact"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Contact
                        </Link>
                    </li>
                    <li>
                        <Link href={"https://x.com/"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Twitter
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                        </Link>
                    </li>
                    <li>
                        <Link href={"https://www.instagram.com/"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Instagram
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                        </Link>
                    </li>
                </ul>
                <ul className="flex flex-wrap items-center justify-center gap-6">
                    <li>
                        <Link to={"/privacy-policy"} className="text-xl text-muted-foreground transition-opacity hover:opacity-75">
                            Privacy Policy
                        </Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}