import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type WagyuLocale = "km" | "en";

export const WAGYU_LOCALES: { code: WagyuLocale; label: string }[] = [
  { code: "km", label: "ខ្មែរ" },
  { code: "en", label: "EN" },
];

export const wagyuEn = {
  "hero.eyebrow": "BOSBA Premium Foods — Japanese Wagyu",
  "hero.title.line1": "The Journey of",
  "hero.title.line2": "Japanese Wagyu",
  "hero.subtitle.line1": "From Miyazaki, Japan.",
  "hero.subtitle.line2": "Raised with care. Crafted by nature.",
  "hero.description": "Discover the story behind Japanese Wagyu A4 & A5.",
  "hero.cta": "Explore the Journey",
  "chapterBeginning.title": "Every Exceptional Wagyu Begins With Where It Comes From.",
  "chapterBeginning.p1": "In Japan, Wagyu is more than beef.",
  "chapterBeginning.p2":
    "It is the result of generations of breeding, careful management and strict standards — a tradition of excellence refined over centuries.",
  "chapterBeginning.p3": "And behind every piece is a place with its own story.",
  "origin.eyebrow": "The Origin",
  "origin.title": "Miyazaki, Japan",
  "origin.intro":
    "On the southeastern coast of Kyushu lies Miyazaki, a region renowned for its Wagyu production. Here, the story of our A5 Wagyu begins.",
  "origin.why.title": "Why Miyazaki?",
  "origin.why.body":
    "Miyazaki Prefecture on the southeastern coast of Kyushu is one of Japan's most recognized regions for Wagyu production. The combination of climate, geography, and generations of dedicated farming has established Miyazaki as a source of exceptional Japanese beef.",
  "chapterAnimal.title": "Before It Becomes Wagyu, It Begins Here.",
  "chapterAnimal.p1":
    "Japanese Wagyu is closely associated with carefully bred cattle and generations of selective breeding.",
  "chapterAnimal.p2":
    "The cattle are raised under controlled management, with attention paid to their development throughout their lives.",
  "chapterAnimal.p3": "The goal is not simply to produce more beef.",
  "chapterAnimal.quote": '"It is to produce exceptional beef."',
  "process.title": "Raised With Care.",
  "sceneCards.env.title": "A Carefully Managed Environment",
  "sceneCards.env.desc":
    "The environment in which cattle are raised plays an important role in their development. Each animal is given space, clean conditions, and the attention required to develop properly.",
  "sceneCards.nutrition.title": "Careful Nutrition",
  "sceneCards.nutrition.desc":
    "Feeding and management are carefully controlled as the cattle develop. Nutrition is managed with precision to support the natural development of the animal.",
  "sceneCards.time.title": "Time Matters",
  "sceneCards.time.desc":
    "Exceptional Wagyu isn't created overnight. It is developed over time through careful breeding, management and patience — from birth through to the finished product.",
  "sceneCards.attention.title": "Attention to Every Animal",
  "sceneCards.attention.desc":
    "Behind the final cut of Wagyu are people who dedicate themselves to raising cattle with care. Each animal receives individual attention throughout its development.",
  "journey.eyebrow": "The Journey Of A Wagyu",
  "journey.step.birth": "Birth",
  "journey.step.growth": "Growth",
  "journey.step.development": "Development",
  "journey.step.finished": "Finished Wagyu",
  "whyWagyu.eyebrow": "Education",
  "whyWagyu.title.pre": "Why is Wagyu",
  "whyWagyu.title.em": "unlike anything",
  "whyWagyu.title.post": "else?",
  "whyWagyu.p1.pre": "The secret lies in",
  "whyWagyu.p1.strong": "Sashi",
  "whyWagyu.p1.post":
    "— the Japanese term for the intricate snowflake-like fat marbling that runs through every fiber of the meat. This intramuscular fat melts at body temperature, creating a buttery, umami-rich experience that no other beef can replicate.",
  "whyWagyu.p2":
    "Japanese Wagyu cattle are raised for 30+ months — nearly triple the time of standard beef — with meticulous care, specialized feed, and stress-free environments. The result is beef graded on a scale from A1 to A5, where A5 represents the absolute pinnacle of quality.",
  "whyWagyu.tier.regular.label": "Regular Beef",
  "whyWagyu.tier.regular.desc": "Standard marbling, everyday flavor",
  "whyWagyu.tier.australian.label": "Australian Wagyu",
  "whyWagyu.tier.australian.desc": "Improved genetics, richer taste",
  "whyWagyu.tier.a4.label": "Japanese Wagyu A4",
  "whyWagyu.tier.a4.desc": "Exceptional snowflake marbling",
  "whyWagyu.tier.a5.label": "Japanese Wagyu A5",
  "whyWagyu.tier.a5.desc": "The pinnacle — pure luxury",
  "whyWagyu.shopBtn": "Shop Now",
  "trust.eyebrow": "Our Promise",
  "trust.title.bosba": "BOSBA",
  "trust.title.em": "Quality",
  "trust.title.post": "Promise",
  "trust.intro":
    "Every step of our process is designed to remove doubt and deliver confidence — so you can focus entirely on the experience of the world's finest beef.",
  "trust.dawn.title": "Dawn Market Inspection",
  "trust.dawn.desc":
    "Every cut is personally inspected at first light, selecting only the finest pieces before the market opens to the public.",
  "trust.cold.title": "Cold Chain Freshness",
  "trust.cold.desc":
    "Unbroken cold chain from Japanese farms to your door. Temperature-controlled at every step to preserve peak quality.",
  "trust.japan.title": "Authentic Japanese Origin",
  "trust.japan.desc":
    "Sourced directly from certified Japanese prefectures. Every piece comes with full traceability documentation.",
  "trust.gift.title": "Premium Packaging",
  "trust.gift.desc":
    "Delivered in luxury insulated packaging with complimentary wagyu sauce and premium black pepper — ready to gift.",
  "trust.cert.title": "JMGA Certified",
  "trust.cert.desc":
    "All Wagyu is graded and certified by the Japan Meat Grading Association, ensuring authentic A4 and A5 standards.",
  "trust.delivery.title": "Reliable Delivery",
  "trust.delivery.desc":
    "Fast, reliable delivery with real-time tracking. Your Wagyu arrives in perfect condition, every single time.",
  "supplyChain.intro":
    "From its origin in Japan to your table in Cambodia, we carefully handle our premium products to preserve the quality you expect from BOSBA.",
  "supplyChain.farm.title": "Miyazaki Farm",
  "supplyChain.farm.sub": "Origin",
  "supplyChain.wagyu.title": "Wagyu",
  "supplyChain.wagyu.sub": "Raised & Graded",
  "supplyChain.quality.title": "Quality Handling",
  "supplyChain.quality.sub": "Inspection",
  "supplyChain.cold.title": "Cold Chain",
  "supplyChain.cold.sub": "Preservation",
  "supplyChain.cambodia.title": "Cambodia",
  "supplyChain.cambodia.sub": "Destination",
  "supplyChain.bosba.sub": "Premium Foods",
  "supplyChain.table.title": "Your Table",
  "supplyChain.table.sub": "Experience",
  "comparison.eyebrow": "The Difference",
  "comparison.title": "Which Wagyu Fits You?",
  "comparison.subtitle": "Drag the slider to compare A4 and A5 marbling side by side.",
  "comparison.a4.tagline": "Balanced Luxury",
  "comparison.a4.desc":
    "Generously marbled, rich and tender — with a balanced beef experience that showcases both the depth of Wagyu flavor and the richness of fine marbling.",
  "comparison.a4.texture": "Tender",
  "comparison.a5.tagline": "Ultimate Indulgence",
  "comparison.a5.desc":
    "Exceptionally marbled, rich and luxurious — made for those who want the full Wagyu experience. The highest grade of Japanese beef.",
  "comparison.a5.texture": "Extremely Tender",
  "comparison.attr.marbling": "Marbling",
  "comparison.attr.richness": "Richness",
  "comparison.attr.beefFlavor": "Beef Flavor",
  "comparison.attr.texture": "Texture",
  "comparison.cta": "Explore",
  "cooking.eyebrow": "Cooking Guide",
  "cooking.title.pre": "Luxury Becomes",
  "cooking.title.em": "Approachable",
  "cooking.subtitle":
    "Three steps. That's all it takes to cook the world's finest beef perfectly at home.",
  "cooking.step1.title": "Bring to Room Temperature",
  "cooking.step1.desc":
    "Remove your Wagyu from the refrigerator 30–45 minutes before cooking. This ensures even cooking throughout and prevents the exterior from overcooking before the center reaches temperature.",
  "cooking.step1.tip":
    "Chef's Tip: Pat dry with paper towels. Season only with fleur de sel — never marinate A5 Wagyu.",
  "cooking.step2.title": "Sear 30–60 Seconds Per Side",
  "cooking.step2.desc":
    "Heat a cast iron or stainless pan until smoking hot. No oil needed — Wagyu's own fat renders immediately. Sear each side for just 30–60 seconds for A5, up to 90 seconds for A4.",
  "cooking.step2.tip":
    "Chef's Tip: Baste with the rendered fat. The Maillard crust is everything — don't move the steak.",
  "cooking.step3.title": "Rest, Then Slice & Serve",
  "cooking.step3.desc":
    "Rest the steak for 2–3 minutes on a warm board. Slice against the grain into thin pieces — Wagyu is best enjoyed in smaller portions to fully appreciate its richness.",
  "cooking.step3.tip":
    "Chef's Tip: Serve with yuzu ponzu or wasabi. A5 pairs beautifully with a light red wine or sake.",
  "cooking.shopBtn": "Shop Now",
  "cooking.method1.title": "Wagyu Steak",
  "cooking.method1.prep": "Salt · Pepper · High Heat",
  "cooking.method1.desc":
    "A thick-cut sirloin, seasoned simply and seared to perfection. Let the marbling do the work.",
  "cooking.method1.tip": "2–3 min each side. Rest before serving.",
  "cooking.method2.title": "Yakiniku",
  "cooking.method2.prep": "Thin slices · Japanese grill",
  "cooking.method2.desc":
    "Thin Wagyu slices on a Japanese grill. The fat renders quickly, creating an extraordinary aroma and flavor.",
  "cooking.method2.tip": "30–45 seconds per side. Serve immediately.",
  "cooking.method3.title": "Wagyu Don",
  "cooking.method3.prep": "Wagyu · Japanese rice · Egg",
  "cooking.method3.desc":
    "Thinly sliced Wagyu over steamed Japanese rice, finished with a soft egg. Simple, satisfying, extraordinary.",
  "cooking.method3.tip": "Slice thin. Cook briefly. Serve over hot rice.",
  "cooking.proTip": "Pro tip",
  "gallery.eyebrow": "Gallery",
  "gallery.title": "The Art of Wagyu",
  "faq.eyebrow": "FAQ",
  "faq.title": "Your Questions, Answered",
  "faq.q1.q": "Why is Japanese Wagyu so expensive?",
  "faq.q1.a":
    "Japanese Wagyu cattle are raised for 30+ months under strict regulations — nearly three times longer than standard beef. The meticulous feeding program, stress-free environment, and limited production create a scarcity that reflects in the price. You're paying for an experience that cannot be replicated.",
  "faq.q2.q": "What is the difference between A4 and A5 Wagyu?",
  "faq.q2.a":
    "Both are exceptional, but A5 represents the absolute pinnacle. A4 has a BMS (Beef Marbling Score) of 6–8, offering rich flavor with balanced fat. A5 scores 9–12, with extreme intramuscular fat that melts at body temperature. A4 is ideal for steak lovers; A5 is a once-in-a-lifetime luxury experience.",
  "faq.q3.q": "How should I cook Japanese Wagyu at home?",
  "faq.q3.a":
    "Keep it simple. Bring to room temperature, heat a dry cast iron pan until smoking, sear 30–60 seconds per side (A5) or up to 90 seconds (A4). Rest 2–3 minutes, slice thinly against the grain. Season only with fleur de sel. No marinades, no sauces needed — the beef is the star.",
  "faq.q4.q": "How is the Wagyu delivered?",
  "faq.q4.a":
    "All orders are shipped in premium insulated packaging with dry ice or gel packs to maintain the cold chain. Your Wagyu arrives frozen and in perfect condition. We include a complimentary wagyu sauce and premium black pepper with every order.",
  "faq.q5.q": "How long can Wagyu stay frozen?",
  "faq.q5.a":
    "Properly stored in your freezer at -18°C or below, Japanese Wagyu can be kept for up to 6 months without any loss of quality. Once thawed in the refrigerator (24 hours), cook within 2–3 days for the best experience.",
  "faq.q6.q": "Is the origin of your Wagyu certified?",
  "faq.q6.a":
    "Yes. All our Wagyu is sourced from certified Japanese farms and graded by the Japan Meat Grading Association (JMGA). We provide full traceability documentation with every order, including the prefecture of origin and official grade certificate.",
  "finalCta.eyebrow": "Begin Your Journey",
  "finalCta.title.pre": "Ready to Experience",
  "finalCta.title.em": "Authentic Japanese Wagyu?",
  "finalCta.body":
    "Not all beef is created equal. This is proof. Explore our collection of certified Japanese Wagyu A4 and A5 — delivered with care, reverence, and a promise of the extraordinary.",
  "finalCta.exploreBtn": "Explore Collection",
  "finalCta.contactBtn": "Contact Our Team",
  "finalCta.badge.certified": "Certified A4 & A5",
  "finalCta.badge.coldChain": "Cold Chain Guaranteed",
  "finalCta.badge.freeSauce": "Free Sauce & Pepper",
  "finalCta.badge.authentic": "Authentic Japan",
} as const;

export type WagyuI18nKey = keyof typeof wagyuEn;
type Dict = Record<WagyuI18nKey, string>;

const km: Dict = {
  "hero.eyebrow": "BOSBA Premium Foods — Japanese Wagyu",
  "hero.title.line1": "ដំណើរការរបស់",
  "hero.title.line2": "សាច់គោជប៉ុន (Wagyu)",
  "hero.subtitle.line1": "មកពីខេត្តមីយ៉ាហ្សាគី ប្រទេសជប៉ុន។",
  "hero.subtitle.line2": "ចិញ្ចឹមដោយការយកចិត្តទុកដាក់ រចនាដោយធម្មជាតិ។",
  "hero.description": "ស្វែងយល់ពីរឿងរ៉ាវនៅពីក្រោយសាច់គោជប៉ុន (Wagyu) កម្រិត A4 និង A5។",
  "hero.cta": "ស្វែងយល់ពីដំណើរការ",
  "chapterBeginning.title": "គ្រប់ផ្នែកនៃសាច់គោជប៉ុន (Wagyu)  ដ៏ល្អឯកចាប់ផ្ដើមពីប្រភពដើមរបស់វា",
  "chapterBeginning.p1": "នៅប្រទេសជប៉ុនសាច់គោជប៉ុន (Wagyu) គឺពិសេសជាងសាច់គោធម្មតា។",
  "chapterBeginning.p2":
    "វាជាលទ្ធផលនៃការបង្កាត់ពូជជាច្រើនជំនាន់ ដែលមានការគ្រប់គ្រងដោយប្រុងប្រយ័ត្ន ទៅតាមស្តង់ដារដ៏តឹងរ៉ឹង ដែលជាប្រពៃណីនៃភាពល្អឯកដែលត្រូវបានបណ្តុះបណ្តាលអស់ជាច្រើនសតវត្សរ៍មកហើយ",
  "chapterBeginning.p3":
    "ហើយនៅពីក្រោយភាពល្អឯកនៃគ្រប់ផ្នែករបស់សាច់គោជប៉ុន (Wagyu) នេះ សុទ្ធតែមានភ្ជាប់ជាមួយរឿងរ៉ាវ និងប្រវត្តិផ្ទាល់ខ្លួន។",
  "origin.eyebrow": "The Origin",
  "origin.title": "មីយ៉ាហ្សាគី ប្រទេសជប៉ុន",
  "origin.intro":
    "នៅឆ្នេរភាគអាគ្នេយ៍នៃកោះគ្យូស៊ូ មានខេត្តមីយ៉ាហ្សាគី ដែលល្បីនិងត្រូវគេទទួលស្គាល់ថាជាតំបន់ដែលគេចិញ្ចឹម និង ផលិតសាច់គោជប៉ុន (Wagyu)។ ទីកន្លែងនេះហើយជាដើមកំណើតនៃរឿងរ៉ាវរបស់សាច់គោជប៉ុន (Wagyu) របស់យើង",
  "origin.why.title": "ហេតុអ្វីមីយ៉ាហ្សាគី?",
  "origin.why.body":
    "ខេត្តមីយ៉ាហ្សាគី គឺជាតំបន់ដែលល្បី និង ត្រូវគេទទួលស្គាល់ទៅលើបរិយាកាស ភូមិសាស្ត្រ និង ការចិញ្ចឹមដោយយកចិត្តទុកដាក់ជាច្រើនជំនាន់។ ហេតុនេះហើយបានធ្វើឲ្យមីយ៉ាហ្សាគីក្លាយជាតំបន់នៃប្រភពសាច់គោជប៉ុនដ៏ល្អឯក។",
  "chapterAnimal.title": "មុននឹងក្លាយទៅជាសាច់គោ ដំណើរការគឺចាប់ផ្ដើមពីទីនេះ",
  "chapterAnimal.p1":
    "សាច់គោជប៉ុន (wagyu) ត្រូវបានស្គាល់ថាជាប្រភេទសាច់ដែលចេញពីពូជសត្វគោដែលបង្កាត់ពូជដោយប្រុងប្រយ័ត្ន និង ឆ្លងកាត់ការជ្រើសរើសពូជជាច្រើនជំនាន់។",
  "chapterAnimal.p2":
    "សត្វគោត្រូវបានចិញ្ចឹមក្រោមការគ្រប់គ្រងយ៉ាងយកចិត្តទុកដាក់ ដោយផ្តោតលើការលូតលាស់របស់វាពេញមួយជីវិត។",
  "chapterAnimal.p3": "គោលដៅមិនមែនគ្រាន់តែផលិតសាច់គោឲ្យបានច្រើនទេ។",
  "chapterAnimal.quote": '"គោលដៅគឺផលិតសាច់គោដែលមានគុណភាពខ្ពស់ និងល្អឯក។"',
  "process.title": "ចិញ្ចឹមដោយការយកចិត្តទុកដាក់",
  "sceneCards.env.title": "បរិស្ថានដែលគ្រប់គ្រងដោយប្រុងប្រយ័ត្ន",
  "sceneCards.env.desc":
    "បរិស្ថានជុំវិញការចិញ្ចឹមមានតួនាទីសំខាន់ក្នុងការលូតលាស់របស់សត្វគោ។ សត្វនីមួយៗទទួលបានទីធ្លាទូលាយ អនាម័យស្អាត និង ការយកចិត្តទុកដាក់ដែលចាំបាច់សម្រាប់ការលូតលាស់ និង ការអភិវឌ្ឍរបស់សត្វគោ។",
  "sceneCards.nutrition.title": "ការផ្ដល់អាហារូបត្ថម្ភដោយការយកចិត្តទុកដាក់",
  "sceneCards.nutrition.desc":
    "ការផ្តល់ចំណី និងការគ្រប់គ្រងត្រូវបានត្រួតពិនិត្យយ៉ាងម៉ត់ចត់ក្នុងអំឡុងពេលសត្វគោលូតលាស់។ អាហារូបត្ថម្ភត្រូវបានរៀបចំយ៉ាងត្រឹមត្រូវ ដើម្បីគាំទ្រការលូតលាស់តាមបែបធម្មជាតិ។",
  "sceneCards.time.title": "សារៈសំខាន់នៃពេលវេលា",
  "sceneCards.time.desc":
    "សាច់គោជប៉ុន (Wagyu) ដែលមានគុណភាពមិនអាចកើតឡើងត្រឹមរយៈពេលក្នុងមួយយប់ទេ។ វាត្រូវការពេលវេលា ក្នុងការបង្កាត់ពូជដោយប្រុងប្រយ័ត្ន ការគ្រប់គ្រង និងការអត់ធ្មត់—ពីកំណើតរហូតដល់ផលិតផលចុងក្រោយ។",
  "sceneCards.attention.title": "ការយកចិត្តទុកដាក់ទៅលើសត្វនីមួយៗ",
  "sceneCards.attention.desc":
    "នៅពីក្រោយផលិតផលចុងក្រោយនៃសាច់គោជប៉ុន (wagyu) គឺញើសឈាមរបស់អ្នកចិញ្ចឹមដែលបានដាក់ទៅក្នុងការចិញ្ចឹមសត្វគោដោយការយកចិត្តទុកដាក់។ សត្វនីមួយៗទទួលបានការថែទាំយ៉ាងជិតដិតពេញមួយដំណាក់កាលលូតលាស់។",
  "journey.eyebrow": "ដំណើររបស់សាច់គោជប៉ុន (Wagyu)",
  "journey.step.birth": "កំណើត",
  "journey.step.growth": "ការលូតលាស់",
  "journey.step.development": "ការអភិវឌ្ឍ",
  "journey.step.finished": "ផលិតផលចុងក្រោយ",
  "whyWagyu.eyebrow": "Education",
  "whyWagyu.title.pre": "ហេតុអ្វីបានជាសាច់គោជប៉ុន (Wagyu)",
  "whyWagyu.title.em": "មិនដូចទៅនឹងសាច់គោ",
  "whyWagyu.title.post": "ដ៏ទៃ?",
  "whyWagyu.p1.pre": "អាថ៌កំបាំងគឺស្ថិតនៅក្នុង",
  "whyWagyu.p1.strong": "(Sashi)",
  "whyWagyu.p1.post":
    "— ដែលជាពាក្យក្នុងភាសាជប៉ុន ប្រើដើម្បីបរិយាយពីខ្លាញ់ដែលមានរសជាតិឆ្ងាញ់ ដោយខ្លាញ់នេះជាសរសៃខ្លាញ់ដែលមាននៅក្នុងសាច់ស្រាប់ដែលទូទៅគេហៅថា (Marbling) ជាតិខ្លាញ់នេះនឹងរលាយនៅពេលអ្នកចម្អិនវា ដោយបង្កើតរសជាតិដ៏សម្បូរបែប ប៊ឺ និងពោរពេញដោយ umami។",
  "whyWagyu.p2":
    "សាច់គោជប៉ុន (Wagyu) ត្រូវបានចិញ្ចឹមក្នុងរយៈពេលជាង 30ខែ ជាមួយនឹងការផ្ដល់ចំណីដែលល្អ ការយកចិត្តទុកដាក់ក្នុងការចិញ្ចឹមយ៉ាងប្រុងប្រយ័ត្ន និង បរិយាកាសដែលគ្មានភាពតានតឹង។ ដំណើរការទាំងនេះនាំមកនូវលទ្ធផលគនៃសាច់គោ ដែលមានលំដាប់ខ្ពស់ និងត្រូវបានចាត់លំដាប់ថ្នាក់ពី A1 ដល់ A5 ដោយ A5 ជាលំដាប់ថ្នាក់ខ្ពស់ជាងគេបំផុត។",
  "whyWagyu.shopBtn": "ទិញឥឡូវនេះ",
  "whyWagyu.tier.regular.label": "Regular Beef",
  "whyWagyu.tier.regular.desc": "Standard marbling, everyday flavor",
  "whyWagyu.tier.australian.label": "Australian Wagyu",
  "whyWagyu.tier.australian.desc": "Improved genetics, richer taste",
  "whyWagyu.tier.a4.label": "Japanese Wagyu A4",
  "whyWagyu.tier.a4.desc": "Exceptional snowflake marbling",
  "whyWagyu.tier.a5.label": "Japanese Wagyu A5",
  "whyWagyu.tier.a5.desc": "The pinnacle — pure luxury",
  "trust.eyebrow": "Our Promise",
  "trust.title.bosba": "BOSBA",
  "trust.title.em": "Quality",
  "trust.title.post": "Promise",
  "trust.intro":
    "គ្រប់ជំហាននៃដំណើរការនីមួយៗរបស់យើង ធ្វើឡើងដើម្បីលុបបំបាត់នូវបន្ទិលសង្ស័យ និង ផ្តល់នូវទំនុកចិត្តដល់អតិថិជនទៅលើផលិតផលមួយនេះ។ ដូច្នេះអតិថិជនគ្រប់រូបអាចផ្តោតទាំងស្រុងលើបទពិសោធន៍នៃសាច់គោដែលមានគុណភាពល្អបំផុតរបស់ពីប្រទេសជប៉ុនជាមួយខាងហាង BOSBA Premium Foods យើងបាន។",
  "trust.dawn.title": "Dawn Market Inspection",
  "trust.dawn.desc":
    "គ្រប់កំណាត់នៃសាច់គោជប៉ុន ត្រូវបានត្រួតពិនិត្យយ៉ាងប្រុងប្រយ័ត្ន មុនការជ្រើសរើសយកមកដាក់លក់ ដោយខាងអ្នកផ្គត់ផ្គង់ផ្ទាល់នឹងទៅដល់ទីតាំងដាក់លក់ពេលព្រឹកមុនពេលផ្សារបើកទៀត ដើម្បីបានកំណាត់នៃសាច់គោជប៉ុនដែលល្អបំផុត។",
  "trust.cold.title": "Cold Chain Freshness",
  "trust.cold.desc":
    "ធានានូវភាពស្រស់នៃសាច់គោជប៉ុន (Wagyu) ដោយគ្រប់ជំហានមុននឹងមកដល់ហាង BOSBA Premium Foods  គឺខាងយើងបានធ្វើការគ្រប់គ្រងទៅលើសីតុណ្ហភាពនៃសាច់យ៉ាងតឹងរឹង និង ជិតដិតដើម្បីធានាបាននូវគុណភាពមួយដែលនឹងមិនធ្វើអោយអតិជនខកជិតទេ។",
  "trust.japan.title": "Authentic Japanese Origin",
  "trust.japan.desc":
    "មានប្រភពនៃការនាំចូលច្បាស់លាស់ដែលមានបញ្ចាក់នូវវិញ្ញាបនបត្រ។ គ្រប់បំណេក និងកំណាត់នៃសាច់សុទ្ធតែមានភ្ជាប់មកជាមួយឯកសារដែលអាចតាមដានបានយ៉ាងត្រឺមត្រូវ។",
  "trust.gift.title": "Premium Packaging",
  "trust.gift.desc":
    "ដឹកជញ្ជូនក្នុងការវេចខ្ចប់ដែលមានការរៀបចំដាក់ក្នុងឡាំងដែលមាននូវទឹកកត្រឹមត្រូវ ដើម្បីរក្សារសីតុណ្ហភាព និង គុណភាព លើសពីនេះក៏មានការថែមជូននូវទឹកជ្រលក់ BBQ និង ម្រេចខ្មៅមួយឈុតផងដែរ។",
  "trust.cert.title": "JMGA Certified",
  "trust.cert.desc":
    "គ្រប់សាច់គោជប៉ុន (Wagyu) ទាំងអស់ត្រូវបានចាត់ចំណាត់ថ្នាក់ និងបញ្ជាក់ដោយសមាគមចាត់ថ្នាក់សាច់ជប៉ុន ដែលធានានូវស្តង់ដារ A4 និង A5 ពិតប្រាកដ។",
  "trust.delivery.title": "Reliable Delivery",
  "trust.delivery.desc":
    "ការដឹកជញ្ជូនលឿន និងអាចទុកចិត្តបានជាមួយនឹងការតាមដានពេលវេលាជាក់ស្តែង។ សាច់គោជប៉ុន (Wagyu) របស់អ្នកនឹងទៅដល់ដៃក្នុងស្ថានភាពដែលល្អឥតខ្ចោះគ្រប់ពេលវេលា។",
  "supplyChain.intro":
    "ចាប់ពីប្រភពដើមនៅប្រទេសជប៉ុន រហូតដល់តុអាហាររបស់អ្នកនៅកម្ពុជា យើងខ្ញុំយកចិត្តទុកដាក់ដោះស្រាយផលិតផលពិសេសរបស់យើង ដើម្បីរក្សាគុណភាពដែលអ្នកទុកចិត្តពី BOSBA។",
  "supplyChain.farm.title": "កសិដ្ឋានមីយ៉ាហ្សាគី",
  "supplyChain.farm.sub": "ប្រភពដើម",
  "supplyChain.wagyu.title": "សាច់គោជប៉ុន (Wagyu)",
  "supplyChain.wagyu.sub": "ចិញ្ចឹម និងវាយតម្លៃ",
  "supplyChain.quality.title": "ការគ្រប់គ្រងគុណភាព",
  "supplyChain.quality.sub": "ត្រួតពិនិត្យ",
  "supplyChain.cold.title": "ការគ្រប់គ្រងសីតុណ្ហភាព2",
  "supplyChain.cold.sub": "ការរក្សាទុក",
  "supplyChain.cambodia.title": "កម្ពុជា",
  "supplyChain.cambodia.sub": "ទិសដៅ",
  "supplyChain.bosba.sub": "Premium Foods",
  "supplyChain.table.title": "តុអាហាររបស់អ្នក",
  "supplyChain.table.sub": "បទពិសោធន៍",
  "comparison.eyebrow": "ភាពខុសគ្នា",
  "comparison.title": "សាច់គោជប៉ុន (Wagyu) មួយនាដែលសាកសមជាមួយអ្នក?",
  "comparison.subtitle": "អូស Slider ទៅមកដើម្បីប្រៀបធៀបរវាង A4 និង A5",
  "comparison.a4.tagline": "Balanced Luxury",
  "comparison.a4.desc":
    "Generously marbled, rich and tender — with a balanced beef experience that showcases both the depth of Wagyu flavor and the richness of fine marbling.",
  "comparison.a4.texture": "Tender",
  "comparison.a5.tagline": "Ultimate Indulgence",
  "comparison.a5.desc":
    "Exceptionally marbled, rich and luxurious — made for those who want the full Wagyu experience. The highest grade of Japanese beef.",
  "comparison.a5.texture": "Extremely Tender",
  "comparison.attr.marbling": "Marbling",
  "comparison.attr.richness": "Richness",
  "comparison.attr.beefFlavor": "Beef Flavor",
  "comparison.attr.texture": "Texture",
  "comparison.cta": "Explore",
  "cooking.eyebrow": "Cooking Guide",
  "cooking.title.pre": "Luxury Becomes",
  "cooking.title.em": "Approachable",
  "cooking.subtitle":
    "3 ជំហានងាយៗ ក្នុងការចម្អិននូវសាច់គោជប៉ុន (Wagyu) ដែលមានគុណភាពល្អបំផុតក្នុងគេហដ្ឋានរបស់អ្នក",
  "cooking.step1.title": "Bring to Room Temperature",
  "cooking.step1.desc":
    "យកសាច់គោជប៉ុន (Wagyu) ចេញពីទូរទឹកក កក យកមកដាក់ខាងក្រៅក្នុងសីតុណ្ហភាពបន្ទប់ធម្មតា រយៈពេល 30-40នាទី មុនពេលចម្អិន។ ការធ្វើបែបនេះ នឹងការពារសាច់ពីការឆ្អិនមិនស្មើរគ្នា នឹងមិនធ្វើអោយសាច់ខាងក្រៅឆ្អិនពេក។",
  "cooking.step1.tip": "គន្លឹះរបស់មេចុងភៅ៖ យកក្រដាសមកផ្ដិតលើសាច់តិចៗឱ្យស្ងួតមុននឹងដាក់ចម្អិន",
  "cooking.step2.title": "​ប្រើរយៈពេល 30-60 វិនាទីក្នុងការប្រែសាច់",
  "cooking.step2.desc":
    "កម្ដៅខ្ទះអោយក្ដៅ មិនចាំបាច់ក្នុងការប្រើខ្លាញ់នោះទេ ខ្លាញ់ដែលចេញពីសាច់នឹងរលាយភ្លាមៗពេលដាច់សាច់ចូលក្នុងខ្ទះ ចម្អិនដោយប្រើ 30-60 វិនាទី ក្នុងការប្រែសាច់ពីម្ខាងទៅម្ខាងទៀត សម្រាប់ A4 និងប្រើពលដល់ 90វិនាទី សម្រាប់ A5",
  "cooking.step2.tip": "គន្លឹះរបស់មេចុងភៅ៖ កុំរំកិលសាច់នៅពេលដាច់ចម្អិនក្នុងខ្ទះ។",
  "cooking.step3.title": "Rest, Then Slice & Serve",
  "cooking.step3.desc":
    "ទុកសាច់ចោលរយៈពេល 2-3 នាទី បន្ទាប់មកអាចហាន់ជាចំណិតទុចល្មម ដើម្បីទទួលបានរសជាតិដ៏សម្បូរបែបនៃសាច់។",
  "cooking.step3.tip":
    "គន្លឹះរបស់មេចុងភៅ៖ អាចទទួលទានបានជាមួយ yuzu ponzu និង wasabi ឬ ជាមួួយទឹកជ្រលក់ BBQ ក៏បាន។",
  "cooking.shopBtn": "ទិញឥឡូវនេះ",
  "cooking.method1.title": "សាច់អាំងវ៉ាហ្គុយ (Wagyu Steak)",
  "cooking.method1.prep": "អំបិល · ម្រេច · កំដៅខ្ពស់",
  "cooking.method1.desc":
    "សាច់សឺឡយកាត់ក្រាស់ ដាក់គ្រឿងផ្សំធម្មតា ហើយអាំងឱ្យបានល្អឥតខ្ចោះ។ ទុកឱ្យលំនាំខ្លាញ់ធ្វើការងាររបស់វា។",
  "cooking.method1.tip": "២–៣ នាទីម្ខាងៗ។ ទុកសម្រាកមុនបម្រើ។",
  "cooking.method2.title": "យ៉ាគីនីគូ (Yakiniku)",
  "cooking.method2.prep": "កាត់ស្តើង · ចង្កូតអាំងជប៉ុន",
  "cooking.method2.desc":
    "សាច់វ៉ាហ្គុយកាត់ស្តើងអាំងលើចង្កូតជប៉ុន។ ខ្លាញ់រលាយលឿន បង្កើតបានក្លិន និងរសជាតិដ៏អស្ចារ្យ។",
  "cooking.method2.tip": "៣០–៤៥ វិនាទីម្ខាងៗ។ បម្រើភ្លាមៗ។",
  "cooking.method3.title": "វ៉ាហ្គុយដុន (Wagyu Don)",
  "cooking.method3.prep": "វ៉ាហ្គុយ · បាយជប៉ុន · ស៊ុត",
  "cooking.method3.desc":
    "សាច់វ៉ាហ្គុយកាត់ស្តើងដាក់លើបាយជប៉ុនចំហុយ បញ្ចប់ដោយស៊ុតទន់។ សាមញ្ញ ស្កប់ស្កល់ និងអស្ចារ្យ។",
  "cooking.method3.tip": "កាត់ស្តើង។ ចម្អិនបន្តិច។ បម្រើលើបាយក្តៅ។",
  "cooking.proTip": "គន្លឹះជំនាញ",
  "gallery.eyebrow": "Gallery",
  "gallery.title": "សិល្បៈនៃសាច់គោជប៉ុន (Wagyu)",
  "faq.eyebrow": "FAQ",
  "faq.title": "ចម្លើយចំពោះសំណួររបស់អ្នក",
  "faq.q1.q": "ហេតុអ្វីបានជាសាច់គោជប៉ុន (Wagyu) មានតម្លៃថ្លៃ?",
  "faq.q1.a":
    "សត្វគោវ៉ាហ្គុយជប៉ុនត្រូវបានចិញ្ចឹមអស់រយៈពេលជាង ៣០ ខែ ក្រោមបទបញ្ជាយ៉ាងតឹងរឹង — ស្ទើរតែបីដងជាងសាច់គោធម្មតា។ កម្មវិធីចិញ្ចឹមដ៏យកចិត្តទុកដាក់ បរិយាកាសគ្មានភាពតានតឹង និងផលិតកម្មមានកម្រិត បង្កើតបានជាភាពខ្វះខាតដែលឆ្លុះបញ្ចាំងក្នុងតម្លៃ។ អ្នកកំពុងបង់ថ្លៃសម្រាប់បទពិសោធន៍ដែលមិនអាចរកបានទីណាមួយទៀត។",
  "faq.q2.q": "តើអ្វីជាភាពខុសគ្នារវាង Wagyu ថ្នាក់ A4 និង A5?",
  "faq.q2.a":
    "ទាំងពីរសុទ្ធតែល្អឯក ប៉ុន្តែ A5 ជាកម្រិតខ្ពស់បំផុត។ A4 មានពិន្ទុ BMS (Beef Marbling Score) ចន្លោះ ៦–៨ ផ្តល់រសជាតិសម្បូរបែបជាមួយខ្លាញ់មានតុល្យភាព។ A5 មានពិន្ទុ ៩–១២ ជាមួយខ្លាញ់ក្នុងសាច់យ៉ាងច្រើន ដែលរលាយនៅសីតុណ្ហភាពរាងកាយ។ A4 សមស្របសម្រាប់អ្នកចូលចិត្តសាច់អាំង ចំណែក A5 ជាបទពិសោធន៍ប្រណីតម្តងក្នុងមួយជីវិត។",
  "faq.q3.q": "តើគួរចម្អិនសាច់គោជប៉ុន (Wagyu) នៅផ្ទះដោយរបៀបណា?",
  "faq.q3.a":
    "ធ្វើឲ្យសាមញ្ញ។ ទុកសាច់ឲ្យមានសីតុណ្ហភាពបន្ទប់ កម្តៅខ្ទះដែករហូតដល់មានផ្សែងចេញ អាំង ៣០–៦០ វិនាទីម្ខាងៗ (A5) ឬរហូតដល់ ៩០ វិនាទី (A4)។ ទុកសម្រាក ២–៣ នាទី កាត់ស្តើងឆ្លងសរសៃសាច់។ លាបអំបិលហ្វ្លើដឺសែលតែប៉ុណ្ណោះ។ មិនចាំបាច់ដេល ឬទឹកជ្រលក់ទេ — សាច់គោគឺជាតួឯកសំខាន់។",
  "faq.q4.q": "តើ Wagyu ត្រូវបានដឹកជញ្ជូនយ៉ាងដូចម្តេច?",
  "faq.q4.a":
    "ការបញ្ជាទិញទាំងអស់ត្រូវបានដឹកជញ្ជូនក្នុងកញ្ចប់ខ្ចប់ប្រណីតដែលរក្សាសីតុណ្ហភាព ជាមួយទឹកកកស្ងួត ឬកញ្ចប់ជែល ដើម្បីរក្សាខ្សែសង្វាក់ត្រជាក់។ សាច់វ៉ាហ្គុយរបស់អ្នកមកដល់ក្នុងស្ថានភាពកកកករ និងល្អឥតខ្ចោះ។ យើងបញ្ចូលទឹកជ្រលក់វ៉ាហ្គុយ និងម្រេចខ្មៅប្រណីតដោយឥតគិតថ្លៃជាមួយរាល់ការបញ្ជាទិញ។",
  "faq.q5.q": "តើ Wagyu អាចទុកកកបានយូរប៉ុណ្ណា?",
  "faq.q5.a":
    "ប្រសិនបើរក្សាទុកឲ្យបានត្រឹមត្រូវក្នុងទូកកនៅសីតុណ្ហភាព -១៨°C ឬទាបជាងនេះ សាច់គោជប៉ុន (Wagyu) អាចរក្សាទុកបានរហូតដល់ ៦ ខែ ដោយគ្មានការបាត់បង់គុណភាព។ នៅពេលរំលាយកកនៅក្នុងទូទឹកកក (២៤ ម៉ោង) សូមចម្អិនក្នុងរយៈពេល ២–៣ ថ្ងៃ ដើម្បីទទួលបានបទពិសោធន៍ល្អបំផុត។",
  "faq.q6.q": "តើប្រភពដើមនៃ Wagyu របស់អ្នកមានវិញ្ញាបនបត្របញ្ជាក់ដែរឬទេ?",
  "faq.q6.a":
    "បាទ/ចាស។ សាច់វ៉ាហ្គុយទាំងអស់របស់យើងមានប្រភពមកពីកសិដ្ឋានជប៉ុនដែលមានវិញ្ញាបនបត្រ និងត្រូវបានវាយតម្លៃដោយសមាគមវាយតម្លៃសាច់ជប៉ុន (JMGA)។ យើងផ្តល់ជូនឯកសារតាមដានប្រភពពេញលេញជាមួយរាល់ការបញ្ជាទិញ រួមទាំងឈ្មោះខេត្តប្រភព និងវិញ្ញាបនបត្រចំណាត់ថ្នាក់ផ្លូវការ។",
  "finalCta.eyebrow": "ចាប់ផ្តើមដំណើររបស់អ្នក",
  "finalCta.title.pre": "ត្រៀមខ្លួនរួចជាស្រេចដើម្បីភ្លក្ស",
  "finalCta.title.em": "សាច់គោជប៉ុន (Wagyu) ពិតប្រាកដឬនៅ?",
  "finalCta.body":
    "សាច់គោមិនមែនមានតម្លៃដូចគ្នាទាំងអស់នោះទេ។ នេះជាភស្តុតាង។ ស្វែងយល់ពីបណ្តុំសាច់គោជប៉ុន (Wagyu) A4 និង A5 ដែលមានវិញ្ញាបនបត្របញ្ជាក់របស់យើង — ដឹកជញ្ជូនដោយការយកចិត្តទុកដាក់ ការគោរព និងការសន្យានៃភាពអស្ចារ្យ។",
  "finalCta.exploreBtn": "ស្វែងយល់បណ្តុំផលិតផល",
  "finalCta.contactBtn": "ទាក់ទងក្រុមការងាររបស់យើង",
  "finalCta.badge.certified": "មានវិញ្ញាបនបត្រ A4 & A5",
  "finalCta.badge.coldChain": "ធានាខ្សែសង្វាក់ត្រជាក់",
  "finalCta.badge.freeSauce": "ទឹកជ្រលក់ និងម្រេចឥតគិតថ្លៃ",
  "finalCta.badge.authentic": "ពិតប្រាកដពីជប៉ុន",
};

const DICTS: Record<WagyuLocale, Dict> = { en: wagyuEn, km };

const STORAGE_KEY = "wagyu-locale";

type Ctx = {
  locale: WagyuLocale;
  setLocale: (l: WagyuLocale) => void;
  t: (key: WagyuI18nKey) => string;
};

const WagyuI18nContext = createContext<Ctx | null>(null);

export function WagyuLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<WagyuLocale>("km");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as WagyuLocale | null;
    if (saved === "en" || saved === "km") setLocaleState(saved);
  }, []);

  const setLocale = (l: WagyuLocale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: WagyuI18nKey) => DICTS[locale][key] ?? wagyuEn[key] ?? key;

  return (
    <WagyuI18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </WagyuI18nContext.Provider>
  );
}

export function useWagyuI18n() {
  const ctx = useContext(WagyuI18nContext);
  if (!ctx) throw new Error("useWagyuI18n must be used within WagyuLanguageProvider");
  return ctx;
}
