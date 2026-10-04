# Daleel · HIO prices and fees

Search tool for Egypt's Health Insurance Organization price lists. Covers **Decree 460/2024** (prices for the non-insured) and **Decree 996/2020** (radiology co-payments for insured beneficiaries). Every amount shows its source and a confidence score.

## Features
- Search over 2,714 records: 1,328 priced 460 items, 1,283 graded operations, 103 rows from decree 996.
  - Arabic normalisation (alef, ya, ta marbuta, diacritics, Arabic-Indic digits, "ال").
  - English↔Arabic synonyms. Codes match with or without zero padding (`CTH-6` = `CTH-006`). One-letter typos tolerated.
- 10 tiers, grouped in one dropdown: not insured (cash, foreigner ×2, contracted entity, staff family −50%) and insured (HIO staff, workforce, female breadwinner, school student, pre-school child, work injury / comprehensive).
- Filters: source, section, confidence, sort; under "More": min/max EGP, surgery grade, "with amount only". There is also a reset button.
- Detail sheet: how the amount is calculated, a confidence bar for each rule, the source text for each rule, the linked 996 row or 460 base price, the same name in other departments, the optional 15% admin fee and the doctor-case amount.
- Estimate: quantities, the multi-operation rule (100/50/50), a toggle for the 15% admin fee, the doctor-case toggle, and an overall confidence.
- Rules sheet: data check, audit corrections, and 150+ rules with search and a category filter.
- English / Arabic with full RTL.

## Design
- Same palette: cream, paper, charcoal, and green/amber/rust confidence colours, plus one gold accent from the logo.
- Plain ledger style: tight radii, hairline rules, monospace numbers and codes, serif headings.
- All controls share one field component: label above the value, 42px height. The filter bar is a single segmented bar.
- All dropdowns are custom listboxes with group headings, counts, a check mark on the selection, and keyboard support (arrows, Home/End, Enter, Esc). They stay inside the viewport on any screen size and in RTL.
- `favicon.svg`: a scalable mark, a stylised "د" on charcoal with a gold baseline. The same SVG is used inline as the header logo.

## Data check (JSON vs app)
Verified in the browser against `data/d460.json` and `data/d996.json`:
- Counts: 16 chapters, 70 tables, 1,328 priced items, 1,283 operations. These match `document.statistics`, and every table's `item_count` matches its items.
- All 1,283 operations map to a grade. Each grade's OR + doctor + anesthesia adds up to its total (800 / 1,400 / 2,500 / 3,750 / 5,000 / 7,500).
- All 103 rows in 996: `ret79 = films × rate`, `ret79 = school_ret`, and `school_ret + school_svc = school_total`. The engine's workforce amount equals the printed value on every row.
- Every rule reference resolves to an item or source text. Every rule id the engine uses is defined. Every code and amount cited in the rules was checked against the data.
- Fixes made during this check:
  - **Conflict detection (R460-T3)** used to flag ICU, intermediate care and incubator (all named "إقامة / يوم") and the three NAT lines as conflicts. These are different services, separated by category or Arabic name, so they are no longer flagged.
  - **996 linking (LINK)**: a mismatch in body region now lowers the match score. For example, CT chest no longer links to CT thoracic spine, and lower-limb X-ray no longer links to lower jaw.
- Earlier corrections are still in place: R996-T1 (plain X-ray range is 80–1,000), R460-Q2 (I.Rad-069 does not exist; it is I.Rad-071), R460-K2 (raised to 0.85).

## Entry URLs
`index.html` parameters:

| Parameter | Values |
|---|---|
| `q` | search text |
| `tier` | `cash`, `foreign`, `contract`, `family`, `staff`, `wf`, `fb`, `st`, `ch`, `wi` |
| `src` | `all`, `460`, `op`, `996` |
| `sec` | `c02`…`c15`, `ops`, `996` |
| `conf` | `high`, `mid`, `low` |
| `sort` | `rel`, `asc`, `desc`, `conf` |
| `lang` | `en`, `ar` |
| `id` | item id (opens the detail sheet) |
| `view` | `rules`, `estimate` |

## Files
- `data/d460.json`, `data/d996.json`, `data/rules.md`: the source files, unmodified.
- `js/rules.js`: the rule catalogue.
- `js/engine.js`: indexing, 996↔460 linking, pricing, search, estimates, stats.
- `js/i18n.js`: interface text (EN/AR).
- `js/app.js`: the interface and the dropdown component.
- `css/style.css`: styles.
- `favicon.svg`: icon and logo.

## Storage
No backend. The estimate, tier and language are saved in `localStorage`.

## Not implemented
- Beneficiary co-payments outside radiology (decrees 282/1975 and 769/2009 were not provided).
- Meal prices, dye unit prices, and the issue date of 460. None of these are in the source.

## Next steps
- Add 282/1975 and 769/2009 when available.
- Print view for the estimate.
- Manual price-uplift factor (R460-S6).
