import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-surface border-t border-border text-foreground mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-brand grid place-items-center text-brand-foreground font-display font-bold">
              B
            </div>
            <span className="font-display text-xl font-bold tracking-tight">BOSBA Premium Foods</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sashimi-grade Japanese seafood, sourced at the market and shipped fresh on ice to your
            doorstep.
          </p>
        </div>

        <div>
          <h4 className="font-display font-bold mb-5 text-sm uppercase tracking-wider">
            Marketplace
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                Sashimi & Fillets
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                Shellfish
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                Roe & Uni
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-5 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                Our Mission
              </a>
            </li>
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                Our Fisheries
              </a>
            </li>
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                Sustainability
              </a>
            </li>
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-border p-6">
          <h4 className="font-display font-bold mb-2">Join the Catch</h4>
          <p className="text-xs text-muted-foreground mb-4">Weekly recipes and market updates.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-white/5 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-brand/50 transition-colors placeholder:text-muted-foreground"
            />
            <button className="px-4 py-2 bg-brand text-brand-foreground rounded-lg text-xs font-bold hover:bg-secondary-accent transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
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
