import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-accent grid place-items-center text-accent-foreground font-display font-bold">
              B
            </div>
            <span className="font-display text-xl font-bold tracking-tight">BOSBA Premium Foods</span>
          </div>
          <p className="text-sm text-background/60 leading-relaxed">
            Sashimi-grade Japanese seafood, sourced at the market and shipped fresh on ice to your
            doorstep.
          </p>
        </div>

        <div>
          <h4 className="font-display font-bold mb-5 text-sm uppercase tracking-wider">
            Marketplace
          </h4>
          <ul className="space-y-3 text-sm text-background/70">
            <li>
              <Link to="/shop" className="hover:text-accent transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-accent transition-colors">
                Sashimi & Fillets
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-accent transition-colors">
                Shellfish
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-accent transition-colors">
                Roe & Uni
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-5 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm text-background/70">
            <li>
              <a className="hover:text-accent transition-colors" href="#">
                Our Mission
              </a>
            </li>
            <li>
              <a className="hover:text-accent transition-colors" href="#">
                Our Fisheries
              </a>
            </li>
            <li>
              <a className="hover:text-accent transition-colors" href="#">
                Sustainability
              </a>
            </li>
            <li>
              <a className="hover:text-accent transition-colors" href="#">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-background/5 border border-background/10 p-6">
          <h4 className="font-display font-bold mb-2">Join the Catch</h4>
          <p className="text-xs text-background/60 mb-4">Weekly recipes and market updates.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-background/10 rounded-lg px-3 py-2 text-xs outline-none placeholder:text-background/40"
            />
            <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-xs font-bold hover:opacity-90">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-background/40">
          <span>© 2026 BOSBA Premium Foods</span>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
