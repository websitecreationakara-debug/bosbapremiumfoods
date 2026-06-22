import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="bg-surface border-t border-border text-foreground mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="BOSBA Premium Foods"
              className="size-12 rounded-lg object-contain"
            />
            <span className="font-display text-xl font-bold tracking-tight">
              BOSBA Premium Foods
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.tagline")}</p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-5 text-sm">{t("footer.marketplace")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                {t("nav.allProducts")}
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                {t("footer.sashimiFillets")}
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                {t("footer.shellfish")}
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-secondary-accent transition-colors">
                {t("footer.roeUni")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-5 text-sm">{t("footer.company")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                {t("footer.mission")}
              </a>
            </li>
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                {t("footer.fisheries")}
              </a>
            </li>
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                {t("footer.sustainability")}
              </a>
            </li>
            <li>
              <a className="hover:text-secondary-accent transition-colors" href="#">
                {t("footer.careers")}
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-muted p-6">
          <h4 className="font-display font-semibold mb-2">{t("footer.joinTitle")}</h4>
          <p className="text-xs text-muted-foreground mb-4">{t("footer.joinSub")}</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className="flex-1 min-w-0 bg-background border border-transparent rounded-lg px-3 py-2 text-xs outline-none focus:border-border transition-colors placeholder:text-muted-foreground"
            />
            <button className="shrink-0 px-4 py-2 bg-brand text-brand-foreground rounded-lg text-xs font-semibold hover:bg-secondary-accent transition-colors">
              {t("footer.join")}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 BOSBA Premium Foods</span>
          <div className="flex gap-6">
            <a href="#">{t("footer.privacy")}</a>
            <a href="#">{t("footer.terms")}</a>
            <a href="#">{t("footer.sitemap")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
