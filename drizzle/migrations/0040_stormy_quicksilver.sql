CREATE TABLE `translations` (
	`locale` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`locale`, `key`)
);
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('_default', 'locale', 'en', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'lang.name', 'English', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'bar.storeLocator', 'Store Locator', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'bar.delivery', 'Free chilled delivery on orders over {threshold}$', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'theme.light', 'Light', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'theme.dark', 'Dark', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.allCategories', 'All Categories', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.browse', 'Browse', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.allProducts', 'All Products', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.megaWagyu', 'Wagyu & Meats', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.megaSeafood', 'Seafood & Sashimi', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.megaOccasion', 'Shop by Occasion', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.megaPantry', 'Pantry & Sake', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.searchPlaceholder', 'Search tuna, salmon, uni, scallops...', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.wishlist', 'Wishlist', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.signIn', 'Sign in', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.adminDashboard', 'Admin Dashboard', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.myOrders', 'My Orders', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.myAddresses', 'My Addresses', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.account', 'Account', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.signOut', 'Sign out', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.cart', 'Cart', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'home.premiumSelection', 'Our Premium Selection', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'home.finestProducts', 'Shop Our Finest Products', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'home.viewAll', 'View all', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'home.shopByCategory', 'Shop by Category', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'home.shopByCategorySub', 'From sashimi to shellfish, all in one place.', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'home.shop', 'Shop', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.delivery.title', 'Chilled Delivery', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.delivery.body', 'Free shipping on orders over ${threshold}', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.sashimi.title', 'Sashimi Grade', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.sashimi.body', 'Sourced from Japanese waters', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.quality.title', 'Quality Promise', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.quality.body', 'Inspected at the market at dawn', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.cold.title', 'Cold-Chain Fresh', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'feature.cold.body', 'Packed on ice, shipped overnight', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'cta.member', 'Become a member', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'cta.title', 'Earn points every time you shop.', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'cta.body', 'Collect 1 point for every $5 you spend at BOSBA Premium Foods. Save up your points and redeem them for free products.', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'cta.join', 'Join BOSBA Plus', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'product.addToCart', 'Add to cart', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'product.noImage', 'No image', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'product.from', 'from', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'product.selectOptions', 'Select options', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.title', 'BOSBA Premium Foods', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.count', '{n} products', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.filters', 'Filters', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.clearAll', 'Clear all', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.search', 'Search', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.searchPlaceholder', 'Tuna, salmon, uni...', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.categories', 'Categories', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.allProducts', 'All Products', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.price', 'Price', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.offers', 'Offers', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.onSaleOnly', 'On sale only', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.sort', 'Sort', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.sort.featured', 'Featured', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.sort.priceAsc', 'Price: Low to High', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.sort.priceDesc', 'Price: High to Low', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.sort.rating', 'Top Rated', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.noProducts', 'No products found', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.noProductsSub', 'Try adjusting your filters or search term.', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'shop.clearFilters', 'Clear filters', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'nav.offers', 'Promotion', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offers.title', 'Special Offers', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offers.subtitle', 'Limited-time deals on our premium picks.', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offers.empty', 'No active offers right now — check back soon!', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offers.viewAll', 'View all offers', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offers.ends', 'Ends {date}', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offer.kind.limited', 'Limited Offer', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offer.kind.seasonal', 'Seasonal Offer', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'offer.kind.special', 'Special Offer', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.tagline', 'Provides High Premium Quality Foods From Japan', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.marketplace', 'Marketplace', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.sashimiFillets', 'Sashimi & Fillets', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.shellfish', 'Shellfish', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.roeUni', 'Roe & Uni', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.followTitle', 'Follow Us', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.followSub', 'Recipes, offers and fresh arrivals on social media.', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.privacy', 'Privacy', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('en', 'footer.sitemap', 'Sitemap', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'lang.name', 'ខ្មែរ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'bar.storeLocator', 'ទីតាំងហាង', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'bar.delivery', 'ដឹកជញ្ជូនត្រជាក់ឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញលើស {threshold}$', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'theme.light', 'ភ្លឺ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'theme.dark', 'ងងឹត', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.allCategories', 'ប្រភេទទាំងអស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.browse', 'រកមើល', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.allProducts', 'ផលិតផលទាំងអស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.megaWagyu', 'វ៉ាហ្គីយូ និងសាច់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.megaSeafood', 'អាហារសមុទ្រ និងសាស៊ីមី', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.megaOccasion', 'ទិញតាមឱកាស', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.megaPantry', 'គ្រឿងផ្សំ និងសាកេ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.searchPlaceholder', 'ស្វែងរក ត្រាប់ ត្រីសាល់ម៉ុង អ៊ូនី...', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.wishlist', 'បញ្ជីប្រាថ្នា', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.signIn', 'ចូលគណនី', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.adminDashboard', 'ផ្ទាំងគ្រប់គ្រង', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.myOrders', 'ការបញ្ជាទិញរបស់ខ្ញុំ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.myAddresses', 'អាសយដ្ឋានរបស់ខ្ញុំ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.account', 'គណនី', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.signOut', 'ចាកចេញ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.cart', 'កន្ត្រក', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'home.premiumSelection', 'ការជ្រើសរើសពិសេសរបស់យើង', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'home.finestProducts', 'ទិញផលិតផលល្អបំផុតរបស់យើង', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'home.viewAll', 'មើលទាំងអស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'home.shopByCategory', 'ទិញតាមប្រភេទ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'home.shopByCategorySub', 'ពីសាស៊ីមី រហូតដល់សត្វសំបកសមុទ្រ ទាំងអស់នៅកន្លែងតែមួយ។', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'home.shop', 'ទិញ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.delivery.title', 'ដឹកជញ្ជូនត្រជាក់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.delivery.body', 'ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញលើស ${threshold}', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.sashimi.title', 'កម្រិតសាស៊ីមី', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.sashimi.body', 'ប្រភពពីដែនទឹកជប៉ុន', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.quality.title', 'ការធានាគុណភាព', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.quality.body', 'ត្រួតពិនិត្យនៅផ្សារពេលព្រឹកព្រលឹម', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.cold.title', 'ស្រស់ត្រជាក់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'feature.cold.body', 'ខ្ចប់ជាមួយទឹកកក ដឹកជញ្ជូនពេលយប់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'cta.member', 'ក្លាយជាសមាជិក', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'cta.title', 'ទទួលបានពិន្ទុរាល់ពេលដែលអ្នកទិញ។', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'cta.body', 'ទទួលបាន ១ ពិន្ទុ សម្រាប់រាល់ការចំណាយ ៥ ដុល្លារ នៅ BOSBA Premium Foods។ សន្សំពិន្ទុរបស់អ្នក រួចប្តូរយកផលិតផលដោយឥតគិតថ្លៃ។', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'cta.join', 'ចូលរួម BOSBA Plus', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'product.addToCart', 'បន្ថែមទៅកន្ត្រក', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'product.noImage', 'គ្មានរូបភាព', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'product.from', 'ចាប់ពី', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'product.selectOptions', 'ជ្រើសរើសជម្រើស', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.title', 'ទិញនៅផ្សារ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.count', '{n} ផលិតផលស្រស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.filters', 'តម្រង', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.clearAll', 'សម្អាតទាំងអស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.search', 'ស្វែងរក', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.searchPlaceholder', 'ត្រាប់ ត្រីសាល់ម៉ុង អ៊ូនី...', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.categories', 'ប្រភេទ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.allProducts', 'ផលិតផលទាំងអស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.price', 'តម្លៃ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.offers', 'ការផ្តល់ជូន', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.onSaleOnly', 'តែទំនិញបញ្ចុះតម្លៃ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.sort', 'តម្រៀប', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.sort.featured', 'លេចធ្លោ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.sort.priceAsc', 'តម្លៃ៖ ទាបទៅខ្ពស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.sort.priceDesc', 'តម្លៃ៖ ខ្ពស់ទៅទាប', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.sort.rating', 'ការវាយតម្លៃខ្ពស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.noProducts', 'រកមិនឃើញផលិតផល', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.noProductsSub', 'សូមកែតម្រូវតម្រង ឬពាក្យស្វែងរករបស់អ្នក។', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'shop.clearFilters', 'សម្អាតតម្រង', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'nav.offers', 'ការផ្តល់ជូន', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offers.title', 'ការផ្តល់ជូនពិសេស', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offers.subtitle', 'ការបញ្ចុះតម្លៃរយៈពេលកំណត់លើផលិតផលពិសេសរបស់យើង។', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offers.empty', 'មិនមានការផ្តល់ជូនទេឥឡូវនេះ — សូមត្រឡប់មកវិញឆាប់ៗ!', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offers.viewAll', 'មើលការផ្តល់ជូនទាំងអស់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offers.ends', 'បញ្ចប់ {date}', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offer.kind.limited', 'ការផ្តល់ជូនមានកំណត់', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offer.kind.seasonal', 'ការផ្តល់ជូនតាមរដូវ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'offer.kind.special', 'ការផ្តល់ជូនពិសេស', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.tagline', 'ផ្គត់ផ្គង់ម្ហូបអាហារគុណភាពខ្ពស់បំផុតពីប្រទេសជប៉ុន', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.marketplace', 'ផ្សារ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.sashimiFillets', 'សាស៊ីមី និងសាច់ត្រី', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.shellfish', 'សត្វសំបកសមុទ្រ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.roeUni', 'ពងត្រី និងអ៊ូនី', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.followTitle', 'តាមដានពួកយើង', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.followSub', 'រូបមន្ត ការផ្តល់ជូន និងទំនិញថ្មីៗនៅលើបណ្តាញសង្គម។', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.privacy', 'ឯកជនភាព', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('km', 'footer.sitemap', 'ផែនទីគេហទំព័រ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'lang.name', '日本語', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'bar.storeLocator', '店舗検索', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'bar.delivery', '{threshold}$以上のご注文で冷蔵配送無料', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'theme.light', 'ライト', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'theme.dark', 'ダーク', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.allCategories', 'すべてのカテゴリー', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.browse', '見る', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.allProducts', 'すべての商品', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.megaWagyu', '和牛・肉類', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.megaSeafood', '海鮮・刺身', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.megaOccasion', 'シーン別に探す', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.megaPantry', '食材・日本酒', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.searchPlaceholder', 'マグロ、サーモン、うに、ホタテを検索...', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.wishlist', 'お気に入り', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.signIn', 'ログイン', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.adminDashboard', '管理ダッシュボード', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.myOrders', '注文履歴', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.myAddresses', '住所帳', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.account', 'アカウント', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.signOut', 'ログアウト', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.cart', 'カート', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'home.premiumSelection', 'プレミアムセレクション', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'home.finestProducts', '厳選された商品', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'home.viewAll', 'すべて見る', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'home.shopByCategory', 'カテゴリーから探す', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'home.shopByCategorySub', '刺身から貝類まで、すべてここに。', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'home.shop', '見る', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.delivery.title', '冷蔵配送', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.delivery.body', '${threshold}以上のご注文で送料無料', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.sashimi.title', '刺身グレード', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.sashimi.body', '日本の海から直送', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.quality.title', '品質保証', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.quality.body', '夜明けの市場で検品', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.cold.title', 'コールドチェーン鮮度', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'feature.cold.body', '氷詰めで翌日配送', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'cta.member', '会員になる', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'cta.title', 'お買い物のたびにポイントが貯まる。', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'cta.body', 'BOSBA Premium Foods でのお買い物5ドルにつき1ポイント獲得。貯まったポイントは商品と交換できます。', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'cta.join', 'BOSBA Plus に参加', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'product.addToCart', 'カートに追加', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'product.noImage', '画像なし', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'product.from', '〜', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'product.selectOptions', 'オプションを選択', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.title', 'マーケットで買う', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.count', '{n} 点の新鮮な商品', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.filters', 'フィルター', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.clearAll', 'すべてクリア', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.search', '検索', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.searchPlaceholder', 'マグロ、サーモン、うに...', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.categories', 'カテゴリー', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.allProducts', 'すべての商品', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.price', '価格', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.offers', 'セール', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.onSaleOnly', 'セール商品のみ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.sort', '並び替え', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.sort.featured', 'おすすめ', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.sort.priceAsc', '価格: 安い順', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.sort.priceDesc', '価格: 高い順', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.sort.rating', '評価が高い順', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.noProducts', '商品が見つかりません', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.noProductsSub', 'フィルターや検索語を調整してください。', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'shop.clearFilters', 'フィルターをクリア', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'nav.offers', 'セール', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offers.title', '特別オファー', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offers.subtitle', '厳選商品の期間限定セール。', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offers.empty', '現在開催中のオファーはありません — またチェックしてください！', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offers.viewAll', 'すべてのオファーを見る', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offers.ends', '{date}まで', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offer.kind.limited', '数量限定オファー', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offer.kind.seasonal', 'シーズンオファー', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'offer.kind.special', '特別オファー', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.tagline', '日本産の高品質プレミアム食品をご提供します', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.marketplace', 'マーケット', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.sashimiFillets', '刺身・切り身', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.shellfish', '貝類', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.roeUni', '魚卵・うに', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.followTitle', 'フォローする', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.followSub', 'レシピ・お得な情報・新着をSNSでチェック。', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.privacy', 'プライバシー', '2026-09-01T00:00:00.000Z');
--> statement-breakpoint
INSERT OR IGNORE INTO `translations` (`locale`, `key`, `value`, `updated_at`) VALUES ('ja', 'footer.sitemap', 'サイトマップ', '2026-09-01T00:00:00.000Z');
