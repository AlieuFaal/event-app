export default function Footer() {
    return (
        <section className='flex flex-col items-center justify-center gap-14 py-32 border-t'>
            <nav className='container flex flex-col items-center gap-4'>
                <ul className='flex flex-wrap items-center justify-center gap-6'>
                    <li className=''>
                        <a href="/events" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Explore Events
                        </a>
                    </li>
                    <li>
                        <a href="/create-event" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Create Event
                        </a>
                    </li>
                    <li>
                        <a href="/about" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            About Us
                        </a>
                    </li>
                    <li>
                        <a href="/faq" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            F.A.Q.
                        </a>
                    </li>
                    <li>
                        <a href="/contact" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Contact
                        </a>
                    </li>
                    <li>
                        <a href="https://x.com/" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Twitter
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com/" className="flex items-center gap-0.5 text-2xl transition-opacity hover:opacity-75">
                            Instagram
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
                        </a>
                    </li>
                </ul>
                <ul className="flex flex-wrap items-center justify-center gap-6">
                    <li>
                        <a href="/privacy-policy" className="text-xl text-muted-foreground transition-opacity hover:opacity-75">
                            Privacy Policy
                        </a>
                    </li>
                </ul>
            </nav>
        </section>
    )
}