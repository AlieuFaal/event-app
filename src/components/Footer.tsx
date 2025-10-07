
import { m } from "@/paraglide/messages";
import { Link } from "@tanstack/react-router";

export default function Footer() {
    return (
        <footer className='flex flex-col items-center justify-center gap-14 py-20 border-t mt-auto'>
            <nav className='container flex flex-col items-center gap-4'>
                <ul className='flex flex-wrap items-center justify-center gap-6'>
                    <li className=''>
                        <Link href="/" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            {m.footer_home()}
                        </Link>
                    </li>
                    <li>
                        <Link to={"/events"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            {m.footer_events()}
                        </Link>
                    </li>
                    <li>
                        <Link to={"/about"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            {m.footer_about()}
                        </Link>
                    </li>
                    <li>
                        <Link to={"/faq" }className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            F.A.Q.
                        </Link>
                    </li>
                    <li>
                        <Link to={"/contact"} className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            {m.footer_contact()}
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
                            {m.footer_privacy()}
                        </Link>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}