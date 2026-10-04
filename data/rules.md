# HIO Pricing Rules: Decree 460/2024 and Decree 996/2020

This is a rule extraction from a close reading of the Arabic text in both uploaded files. It does not re-index the price rows. It covers the logic that sits around the prices: who a decree applies to, what gets added, what is excluded, multipliers, discounts, caps, bundles, and conflicts.

**Confidence scale (applies to every rule)**
- **H (≥ 0.90)**: the text says it explicitly. Apply it as written.
- **M (0.60–0.89)**: needs light interpretation (scope, ordering, or which item to pick). It is very likely correct.
- **L (< 0.60)**: the text is ambiguous or silent. Store both readings and flag the result in search.

Every rule has an ID (`R460-…` / `R996-…` / `RX-…` for cross-decree rules) so your index can refer to it.

---

## 0. TL;DR: how the two decrees relate

| | **Decree 460/2024** | **Decree 996/2020** |
|---|---|---|
| Issuer | HIO Chairman, رئاسة الهيئة | HIO Chairman, الإدارة المركزية للشئون المالية |
| Subject | Full price list for **non-insured** people at HIO units | **Co-payment fees** that **insured beneficiaries** pay for radiology |
| Who pays | Cash patients, contracted entities, foreigners, plus room-class difference for insured people | Insured beneficiaries in 4 schemes (workforce/pensioners/widows, school students, pre-school children, female breadwinners) |
| What you get | A full service price (EGP) | A small fee: film-retention fee per film, plus a 10 % service fee capped at 20 EGP for students and children |

**They are connected in two places only:**
1. **RX-1**: 996's service fee is "10 % of the radiology price per the HIO services price list … and any amendments". The current amendment of that list is **460/2024**. So 996's fee **base** can be computed from 460's radiology prices. (Confidence M 0.65, details in §3.)
2. **RX-2**: An insured beneficiary who wants a better room pays the **room-class difference** at 460's prices, with the insurance bed valued at 50 EGP/day. (H)

Apart from these two, the populations do not overlap. An insured beneficiary is **never** charged the 460 price for the service itself (460 ch.1 §10: the decree does not handle reimbursement for beneficiaries). A non-insured person is **never** charged 996 fees.

---

## 0.5 Payer-class matrix: beneficiaries, HIO staff, staff relatives

This section answers "does 460 cover this class?" It is based on a full-text search of both files for every mention of: منتفع، مؤمن عليه، التأميني، العاملين، موظف، أسر، أقارب، الدرجة الأولى، إصابات العمل، العلاج الشامل، خصم، إعفاء، يعفى، ضعف، الأجانب. **Every clause found is listed below. Nothing else in either file mentions these groups.**

### Short answer

| Class | Does 460 price their services? | What 460 actually says about them | Other source |
|---|---|---|---|
| **Insured beneficiaries** (منتفعين التأمين الصحي) | ❌ **No.** 460 is the price list "لغير المؤمن عليهم" (for the non-insured) | Only: room-class difference, ER rule, discharge-drug scope, no reimbursement | 996 for radiology fees. Other co-payments are in **282/1975 and 769/2009, not provided** |
| **HIO employees** (العاملين بالهيئة) | ❌ **No price discount for themselves** | Exempt from the room-difference deposit, and may pay in monthly instalments | They are insured as employees, so 996 group G-WF applies (inferred) |
| **First-degree relatives of HIO employees** (أقارب) | ✅ **Yes.** They are non-insured cash patients | **50 % off all services**, plus the deposit exemption and instalments | — |

### PC-B: Insured beneficiaries (منتفعي التأمين الصحي)

| ID | Rule (exact source) | Conf. |
|---|---|---|
| PC-B1 | 460 is titled "لغير المؤمن عليهم" (for the non-insured). Its prices are **not** what a beneficiary pays for covered care. | H |
| PC-B2 | Ch.1 §4 groups **three** classes together under the same rules: **health-insurance beneficiaries, work-injury cases (إصابات العمل), and comprehensive-system members (العلاج الشامل)**. Treat all three as "beneficiary-class" for these rules. | H |
| PC-B3 | **Room:** they stay in insurance-class beds in rooms reserved for insured patients (§4أ). An upgrade = chosen class price − **50/day** insurance bed. Companion = **50/day, no meals**. Deposit = 10 days' difference, settled when due or at discharge, whichever is first (§4ب, ch.2 n.4, Art.3ج). | H |
| PC-B4 | **ER:** only "**non-beneficiaries**" are charged ER list prices (ch.1 §3). A beneficiary using ER is **not charged** 460 ER prices. | H |
| PC-B5 | **Discharge drugs** are charged at public price **for non-beneficiaries** (ch.1 §6ب), so beneficiaries are not charged under this clause. | M 0.75 |
| PC-B6 | **Reimbursement** of beneficiaries' treatment costs inside or outside HIO units is **outside** 460 (ch.1 §10). | H |
| PC-B7 | **Medical isolation:** single room, **no class difference** (ch.1 §8). This applies to every patient, including beneficiaries. | H |
| PC-B8 | **Moving to ICU:** ICU only, no ward room charged (ch.1 §7). For a beneficiary, ICU is covered care, so no room-difference charge arises. | M 0.7 |
| PC-B9 | **Radiology co-payment (996):** film-retention fee for all 4 groups, plus a 10 % service fee capped at 20 for students and pre-school children. See §2. | H |
| PC-B10 | **Beneficiary groups named in either file:** law 79/1975 employees, pensioners, widows, female breadwinners, school students, pre-school children/newborns (996). Comprehensive system and work injuries (460). **Families of insured people and pensioners in Alexandria** (PM decree 10/1981) appear **only in 460's preamble**, with no operative rule. They are probably beneficiaries in Alexandria only. | H / L 0.4 (Alexandria) |
| PC-B11 | **Missing for beneficiaries:** clinic, lab, pharmacy and procedure co-payments outside radiology. 996 cites **282/1975** (fees paid on requesting service) and **769/2009 + regulations / 855/2009**. Without these files, search must return "beneficiary co-payment: not in dataset" for non-radiology services. | H |
| PC-B12 | A beneficiary who **opts out** of insurance and is treated as a private cash case: the text does not cover this. If they pay, it is presumably at full 460 prices. | L 0.4 |
| PC-B13 | **Work-injury and comprehensive-system members** do not appear in 996's four groups, so **996 radiology fees do not apply** to them. Nothing in these files sets a radiology fee for them. | M 0.7 |

### PC-E: HIO employees (العاملين بالهيئة العامة للتأمين الصحي)

| ID | Rule | Conf. |
|---|---|---|
| PC-E1 | **No price discount for the employee.** Art.5 gives 50 % to "أسر العاملين" (employees' **families**), not to the employee. | H (text) |
| PC-E2 | Exempt from the **upfront deposit on room-class differences** (ch.1 §4ج). | H |
| PC-E3 | May pay treatment costs in **monthly instalments** (financial regulation 747/1966), on a **written request from the employee**. | H |
| PC-E4 | PC-E2 and PC-E3 sit under the beneficiaries section (§4). So the employee is treated as an **insured beneficiary**, being a government employee under law 79/1975. Their own covered care is not priced by 460. For radiology they fall in 996 **group G-WF** (retention fee only). | M 0.75 |
| PC-E5 | **Do not confuse** with "العاملين بها" in Art.3ب, which means employees of **contracting entities** treated per case. Those pay full 460 prices, billed monthly to their employer (R460-W1). | H |
| PC-E6 | Who counts as an employee is not defined: permanent, contract or over-age staff are not distinguished (the only such list, "معين، متعاقد، فوق السن", concerns doctors' exam-fee shares). Retired HIO staff are not mentioned. | L |

### PC-R: Relatives of HIO employees (الأقارب)

| ID | Rule | Conf. |
|---|---|---|
| PC-R1 | **50 % off all services** for the families of HIO employees, **first-degree relatives only** (Art.5). | H |
| PC-R2 | **First degree** is not defined in the file. Standard Egyptian meaning: **parents and children**. **Spouse:** by kinship law a spouse is related by marriage (مصاهرة), not blood. Administrative practice often includes the spouse as "family" (أسرة). Siblings are second degree, so **excluded**. | H (parents/children) / L 0.5 (spouse) |
| PC-R3 | Relatives are also exempt from the **room-difference deposit**, and may use **instalments** (§4ج, "العاملين بالهيئة وأسرهم"). That clause says only "أسرهم" (their families), with no first-degree limit and no limit to beneficiaries. Apply the Art.5 first-degree limit for consistency. | M 0.65 |
| PC-R4 | **Discount base: "كافة الخدمات" (all services).** It clearly covers stay, exams, procedures, operations, labs, imaging and packages. **Drugs, supplies, implants, dye and purchased blood** are goods priced at cost + markup, and "services" may not include them. The literal reading covers everything on the bill. | H (services) / L 0.5 (goods) |
| PC-R5 | **Stacking:** a foreign relative would get ×2 and then −50 %. Nothing prevents this. | M 0.6 |
| PC-R6 | **15 % admin fee:** calculate it on the discounted invoice. The result is the same either way, because both are percentages (see M5). | M |
| PC-R7 | **"حالة طبيب" (case referred by an HIO doctor) for a relative:** the treating doctor sets and collects their own fee. The 50 % discount applies only to what HIO bills. | M 0.7 |
| PC-R8 | **Relative who is also a beneficiary** (for example a child of an HIO employee covered under the school-student scheme): **no precedence rule**. Covered care goes through the insurance path (996 for radiology). Cash or uncovered care goes through 460 at −50 %. | L 0.5 |
| PC-R9 | **Proof of relationship** (documents) is not specified. | — |

### Final class list for the index

```
payer_class:
  NON_INSURED_EGYPTIAN        → 460 full price
  NON_INSURED_FOREIGNER       → 460 ×2 (except BB-012)
  CONTRACTED_ENTITY_EMPLOYEE  → 460 full price, billed monthly to entity
  HIO_STAFF_RELATIVE_1ST      → 460 −50%  (+ deposit exemption, instalments)
  HIO_STAFF                   → beneficiary path (G-WF) + deposit exemption, instalments
  BENEFICIARY_WF  (law79/pension/widow)  → 996 retention only (radiology); room diff via 460−50
  BENEFICIARY_FB  (female breadwinner)   → same as WF
  BENEFICIARY_ST  (school student)       → 996 retention + min(20, 10%)
  BENEFICIARY_CH  (pre-school/newborn)   → same as ST
  WORK_INJURY / COMPREHENSIVE            → room diff via 460−50 only; no other fee in dataset
modifiers (all classes): ER emergency exemption (445/2014); medical isolation no diff; 15% admin (460 invoices only)
```

---

## 1. Decree 460/2024 rules

### 1.1 Status and scope

| ID | Rule | Conf. |
|---|---|---|
| R460-S1 | Replaces decree 230/2024 and cancels anything that conflicts with it (Art. 1, Art. 6). Prices from 230/2024 or earlier lists must not be returned. | H |
| R460-S2 | Applies at **all HIO units**, **except** units that have their own special price regulations (Art. 2). For those units the search should say "unit-specific tariff may apply". | H |
| R460-S3 | Covered payers (Art. 3): **(a)** citizens treated for a fee at HIO units; **(b)** entities contracted with HIO to treat their employees per case (العلاج بالحالة); **(c)** room-class differences for insured people and beneficiaries of the comprehensive system (العلاج الشامل). | H |
| R460-S4 | The decree does **not** cover reimbursing beneficiaries' treatment costs inside or outside HIO units (ch.1 §10). | H |
| R460-S5 | Effective from the issue date (Art. 7). The issue date is **not** in the file. | H (date unknown) |
| R460-S6 | HIO may raise listed prices by a percentage equal to the increase in service costs whenever needed (ch.1 §11), and the list is reviewed yearly (ch.1 §12). A price index should carry a `valid_from` field and allow a global uplift factor. | H |
| R460-S7 | Currency is EGP. Chapters 14 and 15 print no currency, but the document-level currency is EGP. | H |

### 1.2 Person and payer modifiers (applied to the base price)

| ID | Rule | Conf. |
|---|---|---|
| R460-M1 | **Foreigners** (no Egyptian nationality) pay **2×** every price in the decree (Art. 4). | H |
| R460-M1a | **Exception:** blood bank NAT has its own foreigner line (BB-012 = 300 vs BB-011 = 200 for Egyptians). Use **300 and do not double it**. Doubling would give 600, and 2×200 = 400 would not match the printed foreigner price. | M 0.6 |
| R460-M2 | **Families of HIO employees, first-degree relatives only**, get **50 % off all services** (Art. 5). The text says *families*. It does **not** extend the discount to the employee. | H (family) / M (employee excluded) |
| R460-M3 | HIO employees and their families are **exempt from the upfront deposit** on room-class differences, and may pay treatment costs in **monthly instalments** on written request (ch.1 §4ج). Affects payment terms, not price. | H |
| R460-M4 | **15 % administrative fee** on **all items of the hospital treatment invoice** (ch.1 §9). | H (existence) |
| R460-M4a | Does M4 apply to **outpatient clinic** services? The text says "فاتورة العلاج بالمستشفى" (hospital treatment invoice), which can be read as inpatient only or as any hospital bill. Show the fee as "+15 % admin on hospital invoices" and do not silently fold it into clinic prices. | L 0.55 |
| R460-M4b | Is the 15 % charged **on top of** items that already carry their own markup (drugs/supplies +10 %, dye +10 %, implants +15 %, purchased blood +15 %)? The literal text ("كافة عناصر") says **yes, all items**. | M 0.6 |
| R460-M5 | **Order of operations** is not stated. Recommended order: `base × nationality(1 or 2) → minus 50 % family discount → + item markups → + 15 % admin`. Discount and admin fee commute (both are multiplicative), so only the scope questions in M4a/M4b actually change the total. | M |

### 1.3 Admission, deposits and billing workflow (ch.1)

| ID | Rule | Conf. |
|---|---|---|
| R460-W1 | **Contracted entities, per case:** the referral letter must be stamped and must show patient name, job, national ID and the requested service. Billing is monthly. The claim is sent in the first week of the next month with a summary list and per-case invoices. Payment is followed up within 15 days of receipt. | H |
| R460-W2 | **Private cases (حالات المستشفى):** admission needs a referral letter (from the outpatient clinic or a hospital doctor), stamped, plus a copy of ID. | H |
| R460-W3 | **Deposit** (refundable, held on a temporary receipt) = **10 days' stay** in the chosen class (**5 days** allowed with director approval) **+** expected other services (labs, imaging…) **+** the **full surgery price**, i.e. doctor + anesthesia + OR opening. | H |
| R460-W3a | If the operation type is **not known in advance**, the deposit uses the **advanced operation** price, **7,500 EGP**. | H |
| R460-W4 | When costs reach **75 % of the deposit**, the patient tops up by **5 more days' stay**. Settlement happens at discharge. | H |
| R460-W5 | A service **bought from outside the hospital** is charged at **actual cost + ambulance fee**. The ambulance fee for this case is **350 EGP** (ch.2 note 7أ). | H |
| R460-W6 | **Insured room upgrade:** pay the difference between the insurance bed and the chosen class, with **10 days' difference paid in advance** (temporary receipt). Settle when due or at discharge, whichever is first (ch.1 §4ب). | H |

### 1.4 Emergency department (ch.1 §3, ch.10)

| ID | Rule | Conf. |
|---|---|---|
| R460-E1 | **Non-beneficiaries** using reception/ER pay the list prices **except** for emergency cases defined by Minister of Health decree **445/2014** (implementing PM decree 1063/2014). Those emergency cases are **outside** this pricing. The 460 file does not say what those cases are charged. (From outside the file: 1063/2014 is the free emergency treatment decree, usually read as the first 48 h. Treat that as **L**, it is not in the source.) | H (exemption) / L (48 h) |
| R460-E2 | ER drugs and medical consumables are added at the **unified purchase price + 10 % admin** (ch.10 note). | H |
| R460-E3 | ER items marked "بدون مستهلكات" / "بدون ادوية ومستلزمات" (without consumables / drugs and supplies) mean consumables are added under E2. | H |
| R460-E4 | The ER doctor exam is **OP-001 = 100** ("resident at reception and ER"). | H |
| R460-E5 | Adult and child casting are separate tables (ER-041…052 adult, ER-053…064 child) and some prices differ (for example an above-knee cast is 350 for adults and 400 for children). **No age cut-off is defined for "أطفال".** The only age the decree defines anywhere is under 12, and that is for companions. | L 0.5 for using 12 |
| R460-E6 | Oxygen through a nasal line in ER is **20/hour** (ER-014). This matches the ward oxygen rate. | H |

### 1.5 Inpatient stay and ward services (ch.2)

| ID | Rule | Conf. |
|---|---|---|
| R460-I1 | Room prices are **per patient per day**: Suite 1000, First 750, Second 350, "special cases in the insurance class" 150. Companions: 100 in Second class, 50 in the insurance class (InP-003.1 / InP-004.1). | H |
| R460-I2 | **Meals:** Suite and First include meals for **patient and companion**. Other classes include meals for the **patient only**. Companion prices in Second and insurance class **exclude meals**. Special insurance-class cases (InP-004) are printed "غير شامل الوجبات" (meals not included), which contradicts "patient-only meals included". Trust the **item note** for InP-004. | H / M for InP-004 |
| R460-I3 | **Meal price** is set yearly from the contract price + 10 % hotel services. It is **not in the file**, so return "variable". | H |
| R460-I4 | **Mandatory companion** = a child under 12, or a patient whose condition needs a companion (stroke, blind, deaf, immobile elderly…), after the director approves. They are **exempt from the stay fee** and pay **meals only, if requested**. | H |
| R460-I5 | **Insured patient room difference:** the insurance bed is valued at **50/day**, so difference = class price − 50 (Suite 950, First 700, Second 300, special insurance-class 100). A companion for an insured patient costs **50/day without meals**. | H (formula) |
| R460-I6 | **ICU / intermediate care / incubator** cost 1500 / 1000 / 1000 per day. That includes medical and nursing service, all devices, the gas network and **blood gas analysis**. So **no separate oxygen or ABG charge** inside these units. | H (inclusion) / M (no separate ABG) |
| R460-I7 | **Transfer to ICU:** charge ICU only. The ward room is **not** charged and stays at the hospital's disposal (ch.1 §7). | H |
| R460-I8 | **Medical isolation:** single room with **no class difference** charged (ch.1 §8). | H |
| R460-I9 | **Cross-specialty consult:** consultant **400/visit**, specialist **250/visit**. An outside doctor needs written director approval, and that fee is settled privately between patient and doctor, not by the hospital. | H |
| R460-I10 | **Private nursing:** **250 per 6-hour shift**, with director approval. Outside nurses are not allowed. | H |
| R460-I11 | **Ambulance on request:** **350** within the governorate / **450** outside, **+5 EGP/km**, **+50/hour waiting**, **+200** if a ventilator is needed, **+300** if a doctor accompanies. Whether the per-km charge applies to both trip types is not stated clearly. Read it as applying to both. | H (amounts) / M (km on both) |
| R460-I12 | **Home visit outside HIO units:** **200/visit**, and the requester provides suitable transport. (The 50 EGP doctor share and 30 EGP staff share are internal payouts, not patient prices. Do not index them as prices.) | H |
| R460-I13 | **Drugs, medical supplies and special infant foods (milk etc.):** **supply price + 10 %**. | H |
| R460-I14 | **Ward oxygen** (outside ICU/incubators): **20/hour**, partial hours rounded **up**. | H |
| R460-I15 | **Discharge drugs:** one week's supply, added to the bill "بسعر الجمهور لغير منتفعي التأمين الصحي" (at the public price for non-beneficiaries). For non-insured patients this **overrides** I13 (supply price + 10 %) for discharge drugs only. Insured beneficiaries are not charged under this clause (see PC-B5). | M 0.75 |
| R460-I16 | Any other service is priced from this decree (ch.2 note 11). | H |
| R460-I17 | Room classes cannot be changed without the Central Administration for Medical Affairs (internal governance, no price effect). | H |
| R460-I18 | **Follow-up after discharge** happens at the outpatient clinic at list prices (ch.1 §6أ). The English report is the detailed one and the Arabic report is a summary. Patients may get copies of results on written request to the social service office. No fee is printed for copies. | H |

### 1.6 Surgery (ch.3 plus the operations catalog)

**The operations catalog (1,283 operations) has no prices.** It only gives a **grade**. The price comes from the grade-to-price matrix:

| Grade | grade_key | OR opening | Doctor | Anesthesia | **Total** |
|---|---|---|---|---|---|
| صغرى | minor | 500 | 200 | 100 | **800** |
| متوسطة | medium | 800 | 400 | 200 | **1400** |
| كبرى | major | 1000 | 1000 | 500 | **2500** |
| مهارة | skill | 1500 | 1500 | 750 | **3750** |
| ذات طابع خاص | special_equipment | 2000 | 2000 | 1000 | **5000** |
| متقدمة | advanced | 3000 | 3000 | 1500 | **7500** |

| ID | Rule | Conf. |
|---|---|---|
| R460-O1 | `operation_price = matrix[grade].total`. Grade spellings متوسطه/متقدمه are the same as متوسطة/متقدمة. | H |
| R460-O2 | **Always added on top:** stay at list price with a **minimum of 1 day**; all pre-op and post-op services; supplies and implants (valves, pacemakers, stents, arterial grafts, staplers, meshes, artificial joints, lenses) at **supply price + 15 %**; blood and products at list price; special-equipment fees inside the OR (table below). | H |
| R460-O3 | **OR special equipment fees:** CUSA 4000, radiofrequency 900, surgical navigation 4000, LigaSure/Harmonic 3000, ortho fibre-optic light source 600, HD endoscope 1200, IABP 1000/day. | H |
| R460-O4 | **Several operations, same specialty, same session:** the operation with the highest grade is charged in full, the lower ones at **50 %**, with **at most 2 extra operations charged**. Operations beyond the 2nd extra add nothing. | H (rule) / M 0.75 (50 % taken on the full total, not per component) |
| R460-O5 | **Several operations, different specialties:** **100 %** for each specialty. Within one specialty, apply O4. | H |
| R460-O6 | **"حالة مستشفى" (hospital case):** doctor and anesthesia fees are charged per the list. | H |
| R460-O7 | **"حالة طبيب" (case referred by an HIO doctor):** the doctor sets and collects the doctor and anesthesia fees. HIO bills **only the OR opening plus everything else**. In search, show `OR opening only + "doctor/anesthesia fees set by treating doctor"`. | H |
| R460-O8 | An **operation not in the catalog** is graded by **2 consultants + head of department**, approved by the hospital director, and reported to the Central Medical Affairs administration. Search should return "not listed: grade set by committee" and may show the 800–7500 range. | H |
| R460-O9 | Decree 489/2018 still governs doctor-fee accounting inside packages. That is internal, with no patient-price effect. | H |
| R460-O10 | Headings vs codes: "General surgery **and oncology surgery**" holds only GS codes. Pediatric surgery (PedS) repeats some adult operations (for example gallbladder removal is PedS and also GS-183 open = skill / GS-232 laparoscopic = special_equipment). **No rule picks PedS vs GS by age.** Match on specialty or department, and when ambiguous show both. | L |
| R460-O11 | Grade can differ by **technique**. Laparoscopic is often "ذات طابع خاص" (special) and open is "مهارة" (skill). Word variants (منظار / جراحياً) must match strictly and must not be collapsed by fuzzy matching. | H |

### 1.7 Packages: open-heart and transplant (ch.4)

| ID | Rule | Conf. |
|---|---|---|
| R460-P1 | Billed as an **all-inclusive package** for the set number of ICU days + ward days per item. Included: doctor, anesthesia, OR opening, stay and medical supervision, gas network, all tests during the stay, and drugs and supplies **during surgery**. | H |
| R460-P2 | **Not included:** IABP and mechanical or tissue valves; blood and products; stay beyond the set days; extra consultants from other specialties; dialysis. Each is billed per list on top. | H |
| R460-P3 | Item names also exclude the valve price (OHS-001/002/006/007), the graft (OHS-006) and the cochlear device (CI). | H |
| R460-P4 | **Extra days** are charged at ICU 1500/day or the ward class price. | M 0.8 |
| R460-P5 | The package does not say which room class it assumes, and has no upgrade rule (cath does have one). Probably a default/standard class, with the upgrade difference charged on top. | L 0.5 |
| R460-P6 | Do O4 (multi-op) and M4 (15 % admin) apply to packages? O4: almost certainly **no**, a package is one price. M4: unclear, apply the literal "all invoice items". | M for O4 / L for M4 |
| R460-P7 | Codes RI (kidney transplant) and CI (cochlear implant) are printed **without numbers**. | H |

### 1.8 Dialysis (ch.5)

| ID | Rule | Conf. |
|---|---|---|
| R460-D1 | The prices above **exclude** stay and treatment/drugs. The printed "الاسعار عالية" is a misprint of "الأسعار عاليه" ("the prices above"), **not** "high prices". | H |
| R460-D2 | **Plasma exchange 5000** includes filter + consumables, and anything **beyond** that is borne by the patient. The item note says "+ سعر المستلزمات" (plus supplies). Reconciled reading: 5000 covers the standard filter and consumables, and extra supplies are added at supply + 10 %. | M 0.6 |

### 1.9 GI endoscopy (ch.6)

| ID | Rule | Conf. |
|---|---|---|
| R460-G1 | Items marked "(بدون ثمن …)" (without the price of …) exclude that device or drug: ampoule, clips, capsule, tube, balloon, stent. Add it at **supply price + 10 %**. | H |
| R460-G2 | **Anesthesia/sedation is not included** and is billed separately when used: Pain-029 **250** (GI endoscopy) / Pain-030 **400** (ERCP). | M 0.75 |

### 1.10 Catheterization (ch.7)

**Cardiac cath (CTH-001…032)**

| ID | Rule | Conf. |
|---|---|---|
| R460-C1 | **Included:** stay for **at most 1 day** in a double room or cath care unit (unless the item says otherwise), cath room opening, doctors' fees, and **100 cc of contrast**. Extra contrast is added per ampoule. | H |
| R460-C2 | **Not included:** extra stay; any imaging, labs or investigations; any drugs, supplies or consumables; fees from other specialties. | H |
| R460-C3 | **Room upgrade:** the patient pays the price difference **before** moving to the higher class. | H |
| R460-C4 | **Add-ons go on top of the base cath price:** IVUS +3000 (CTH-008), CTO +30000 (CTH-009), FFR/IFR +3000 (CTH-011), **general anesthesia +3000** (CTH-032). Each extra balloon, wire or stent adds its own price (CTH-004…007). | H |
| R460-C5 | Items with **stay written into the name**: TAVI (CTH-012) includes 2 ICU + 3 ward days. CRT-D (CTH-018) includes 1 ICU + 1 ward day. | H |
| R460-C6 | **Conflict:** CTH-032 "GA added to the procedure" is **3000**, while Pain-032 "anesthesia for cardiac cath services" is **750**. Likely reading: CTH-032 = general anesthesia, Pain-032 = sedation or anesthesia support from the pain unit. Show both. | L 0.5 |

**Vascular cath (CTH-033…043)**

| ID | Rule | Conf. |
|---|---|---|
| R460-C7 | **Included:** cath room fee + **24 h stay in cath care**. **Not included:** supplies, consumables, drugs, stay (meaning stay **beyond the 24 h**), any other service. | H / M (stay reconciliation) |
| R460-C8 | Balloon or stent prices are added where the item says so (CTH-034/035/036). | H |

### 1.11 Pain unit, chest unit, oncology (ch.8, 9, 11)

| ID | Rule | Conf. |
|---|---|---|
| R460-A1 | **Anesthesia add-ons** for other departments' services (Pain-027…033): X-ray 250, MRI 400, GI endoscopy 250, ERCP 400, ESWL 250, cardiac cath 750, neuro cath 1500. Charge only when anesthesia is actually given. | H |
| R460-N1 | **Radiotherapy units:** 3D and IMRT are priced **per week of 5 sessions** (NUC-034 / NUC-038). 2D is priced per course: radical ≥3 weeks 4500, palliative <3 weeks 3000, single session 300. | H |
| R460-N2 | **Duplicate names inside nuclear medicine:** NUC-013 = NUC-016 (adrenal scan, 4000); NUC-014 = NUC-018 (lacrimal, 1000); **NUC-015 (1200) vs NUC-017 (1000)** for the same name (stomach and oesophagus scan): a **price conflict**. | H (conflict exists) |

### 1.12 Outpatient clinics (ch.12)

| ID | Rule | Conf. |
|---|---|---|
| R460-K1 | **Exam fees:** GP / ER resident 100, specialist 150, consultant 250, all specialties. | H |
| R460-K2 | **Medical report:** the patient pays the **exam fee of the doctor who writes it** at that doctor's level (specialist 150 / consultant 250). No separate report price is printed. | M 0.65 |
| R460-K3 | 50 % of the exam fee goes to the signing doctor. Internal split, **not** a patient price. | H |
| R460-K4 | **Dental partial denture:** 1 tooth **400** (DNT-031); each extra tooth **up to 6 teeth +300** each (DNT-032); **more than 6 teeth on one side = half denture 2500** (DNT-033/035 = DNT-029). Immediate single tooth = 500, extraction not included. | M 0.75 |
| R460-K5 | **Ortho clinic** uses the ER codes and **the same prices** as ch.10 (ER-039…068). One service, two contexts. | H |
| R460-K6 | **Per-eye / per-side pricing:** many items exist as "one eye / both eyes" or "one side / both sides". Match laterality exactly, and never multiply single-side × 2 when a bilateral item exists. | H |
| R460-K7 | **Physiotherapy** prices step by number of limbs (1/2/3/4). The programmes (Ph.Th-028/029) are **session bundles** (6 or 12 sessions). | H |

### 1.13 Radiology (ch.13)

| ID | Rule | Conf. |
|---|---|---|
| R460-X1 | Contrast, barium and Gastrografin are **not** in the price. They are added at the **unified purchase price + 10 % admin**. This applies to plain, digital, Doppler (Doppler title: "excludes dye ampoules"), CT and MRI. | H |
| R460-X2 | **Contrast injection fee** of **300** exists for CT (CT-051) and MRI (MRI-097). Should it be added automatically to every "بالصبغة" (with contrast) item? Not stated. | L 0.5 |
| R460-X3 | **Plain X-ray:** priced by **number of views**. **Any additional view = 80** (Rad-107). Special views are 80 each (Rad-013/017/076/080/086). | H |
| R460-X4 | **Interventional radiology** prices exclude dye and supplies (table title). | H |
| R460-X5 | **CT "special skill" subsection** (CT-052…054) restarts serial numbering at 1. Key on code or position, not serial. | H |
| R460-X6 | Consistent cross-chapter duplicates: Card.-008 = CT-050 (3000), Card.-009 = MRI-058 (3500), Card.-005 = US-011 (400), Card.-006 = US-012 (1000). They agree, so they can be merged in search. | H |
| R460-X7 | **I.Rad code gap:** serial 68 maps to I.Rad-070. Codes I.Rad-068 and 069 do not exist. | H |

### 1.14 Labs and blood bank (ch.14, 15)

| ID | Rule | Conf. |
|---|---|---|
| R460-L1 | Lab names are English with source spelling errors (Billirubin, Triglycride, Serolimus…). Search should normalize spelling, but the display should keep the printed text. | H |
| R460-L2 | Items marked "(Each)" are per unit: Factor Assay (Each), IHC marker (Each). Quantity × price. | H |
| R460-L3 | Duplicates as printed: Lab.-231/232 (the same Chlamydia IgG name); Lab.-266/267 Monospot (**160 vs 145**, a price conflict); Lab.-254/255 IgE food allergy (1600 both). | H |
| R460-B1 | **Purchased blood or products:** **purchase price + 15 %** (ch.15 note). Also listed in ch.3 as part of surgery add-ons. | H |
| R460-B2 | **NAT tiers:** Egyptian 200 / foreigner 300 / urgent 500. See M1a on doubling. Whether "urgent" stacks with "foreigner" is not stated. | H / L stacking |
| R460-B3 | **Paediatric packed RBC by volume:** up to 50 ml 170; up to 100 ml 280; "< 100 ml" 835. The third line is almost certainly **"> 100 ml"** (a sign flipped by right-to-left printing), since 835 equals the adult unit. | M 0.75 |

### 1.15 Data traps that affect search (460)

| ID | Trap | Handling |
|---|---|---|
| R460-T1 | **Codes are not unique.** US-001 is both ultrasound (ch.13) and urology surgery. ENT-001 is both clinic and surgery. ER-001…068 appear in ch.10 and ch.12. ER-033 appears twice in ch.10 (foreign body removal and one-sided ear wash). Der-005 ×4. Neu.-004…009 are reused. | Always key on `(chapter, table, position)`, which is the merged `id`. Use the code only as an alias. |
| R460-T2 | The same service has **different prices in different contexts**, for example: ventilator 600/12 h (ward) vs 300/12 h (ER); air mattress 100/day (ward) vs 50/day (chest unit); CVP 400 (ward) vs 150 (chest unit); endotracheal tube 400 vs 150 (ER); chest tube 500 (ward) vs 1200 (chest unit) vs minor operation (GS-008); pleural tap 600 (ward and chest) vs 1350 (interventional radiology). | Search must take a **department/context** input. When it is missing, return all options grouped by department. |
| R460-T3 | Same name, different price, same table: ENT-006 (250) vs ENT-008 (350) "منظار ضوئى للأنف" (optical nasal endoscope); NUC-015/017; Lab.-266/267. | Show both and flag "source conflict". |
| R460-T4 | GS-260 is printed twice with different operations. OphS-005/006 are identical. | Keep both. |
| R460-T5 | Chapter 2 serials skip 6; companion rows have no serial. | Ignore serials. |

---

## 2. Decree 996/2020 rules (insured beneficiaries' radiology co-payment)

### 2.1 Scope

| ID | Rule | Conf. |
|---|---|---|
| R996-S1 | Applies to **insured beneficiaries** only (منتفعى التأمين الصحي). It is a co-payment, not a service price. | H |
| R996-S2 | Covers "**الأشعة بأنواعها**" (radiology of all kinds). The tables list CT, MRI, mammography/scanogram, digital X-ray, interventional and plain X-ray. Panorama and barium have per-film rates but **no table rows**. **Ultrasound, Doppler and nuclear medicine are not listed** (see R996-G4). | H |
| R996-S3 | Status: the file has no repeal, and 460/2024 does not mention 996 (460 concerns non-insured people, so it does not conflict). Treat as in force, **but** check whether the 2020 fee amounts were later changed. | M 0.6 |

### 2.2 Beneficiary groups (the "class" input)

| Group | Arabic | Retention fee | Service fee |
|---|---|---|---|
| **G-WF** Workforce: employees under law 79/1975, pensioners, widows | القوى العاملة (موظفين ومعاشات وأرامل) | ✅ | ❌ |
| **G-FB** Female breadwinners (law 23/2012) | المرأة المعيلة | ✅ | ❌ |
| **G-ST** School students (law 99/1992) | الطلبة / طلبة مدارس | ✅ | ✅ |
| **G-CH** Pre-school children / newborns (law 86/2012) | الأطفال دون السن المدرسي / المواليد | ✅ | ✅ |

The table columns show this: `ret79` = "قانون 79 والمعاشات والأرمل والمرأة المعيلة" (law 79, pensions, widows and female breadwinners), and `school_*` = "طلبة مدارس والمواليد" (school students and newborns). Groups not mentioned (work injuries, comprehensive-system members, others) are **out of scope** for 996. (H)

### 2.3 Fee formulas

| ID | Rule | Conf. |
|---|---|---|
| R996-F1 | **Film-retention fee** = `films × rate`, with rates per film: plain X-ray 4, panorama 4, barium 4, **mammogram 5**, CT 8, digital X-ray 8, **MRI 12**. Applies to **all four groups**. | H |
| R996-F2 | **Service fee** (G-ST and G-CH only) = `min(20, 10 % × radiology price)`, "for cases inside and outside HIO", with the price taken from the HIO service price list (decree 277/2017 "and any amendments"). | H (formula) |
| R996-F3 | **Total** for G-ST and G-CH = retention + service. For G-WF and G-FB = retention only. | H |
| R996-F4 | **Interventional radiology:** no films, so the retention fee is **0** for G-WF and G-FB (the column is printed empty), and G-ST and G-CH pay a **20** service fee only. | H |
| R996-F5 | **When collected:** fees for each scheme are collected **before the patient is referred outside HIO units**. The tables are printed as **guidance** ("يتم الإسترشاد بالجداول"). | H |
| R996-F5a | Is the retention fee also charged **inside** HIO units? The service-fee clause says "inside and outside" explicitly. The retention-fee clause does not limit location, and the collection sentence only sets *when* collection happens for outside referrals. Reading: it applies both inside and outside. | M 0.65 |

### 2.4 Printed table vs formula: which wins

The tables were computed with **2020-era prices**. For **CT, MRI, mammography, digital and interventional**, the printed service fee is already at the **20 cap**, so table and formula agree.

For **plain X-ray** the printed service fees are 5, 6, 9, 15 and 17, which means old base prices of 50–170. Under **460/2024** plain X-ray prices are **200–350** (Rad-001…), so `10 % ≥ 20`, and the formula now gives **20** for almost every plain X-ray (the exceptions are 80 EGP special views, which give 8).

| ID | Rule | Conf. |
|---|---|---|
| R996-T1 | **Formula reading (dynamic):** recompute the service fee from the current price list (460). Plain X-ray becomes 20 in most cases. This follows the wording "وما يستجد من أي تعديلات عليه" (and any later amendments). | M 0.65 |
| R996-T2 | **Table reading (static):** use the printed amounts (5–17). This is what desks might still use in practice. | L 0.35 |
| R996-T3 | **Recommendation:** store both, show the dynamic value as primary with a "printed table: X" note. | — |

### 2.5 Data traps (996)

| ID | Trap | Conf. |
|---|---|---|
| R996-D1 | **MRI spine (rows 11/12):** without contrast = 5 films / 60, with contrast = 4 films / 48. That is reversed from every other pair, so the rows were probably swapped in print. Show as printed and flag. | M 0.7 (swap) |
| R996-D2 | **Duplicates:** MRI ear bones rows 9/10 = 15/16; plain X-ray wrist rows 22/23; nasal septum rows 9/13. | H |
| R996-D3 | **Digital X-ray rows 3/4 vs 7/8:** the same name ("abdomen and pelvis") with 3/4 films vs 4/5 films. Rows 7/8 look copied from the CT list, where they are 3D/multi-slice abdomen and pelvis. | M 0.7 |
| R996-D4 | **Plain X-ray row 2:** "urinary tract with contrast" has a service fee of 5 (base 50), which is odd for a contrast study (row 1 bladder with contrast = 15). Possible print error. | L |
| R996-D5 | **PET-CT** (CT row 14) needs an **oncology committee decision**. In 460, PET-CT is nuclear medicine NUC-023 (9050), not ch.13 CT. Map it there for the base price. | H (requirement) / M (mapping) |

### 2.6 Gaps (no explicit rule)

| ID | Gap | Suggested handling | Conf. |
|---|---|---|---|
| R996-G1 | Panorama and barium have a per-film rate but no row, so the film count is unknown. | Return the rate per film and ask for or assume the film count (barium studies are usually 2–4). | L |
| R996-G2 | Radiology types not in the tables (for example new 460 items such as MRI spectroscopy, CT angiography variants). | Map by type to the per-film rate. Film count is unknown, so default to the nearest analogous row. | L |
| R996-G3 | Contrast/dye cost for insured beneficiaries is **not addressed** in 996. | Do not apply 460 dye charges to beneficiaries. | M |
| R996-G4 | **Ultrasound / Doppler:** no films, so no retention fee. Does the 10 % service fee apply to G-ST/G-CH? "الأشعة بأنواعها" (radiology of all kinds) suggests yes, but there are no rows. | L 0.5 |

---

## 3. Cross-decree rules

| ID | Rule | Conf. |
|---|---|---|
| RX-1 | **The 996 service-fee base comes from the 460 price.** 996 cites the price list "277/2017 and amendments". 460 calls the original list **377/2017**, amended by 230/2024 and now replaced by 460/2024. "277" vs "377" is almost certainly a typo or OCR error for the same 2017 non-insured price list. | M 0.65 |
| RX-1a | When computing the RX-1 base, use the **plain list price**: no foreigner ×2, no 15 % admin, no dye. | M 0.75 |
| RX-2 | **Insured room upgrade:** difference = 460 class price − 50, plus a 50/day companion (no meals), with 10 days' difference as deposit (waived for HIO staff and families). | H |
| RX-3 | An insured beneficiary using an HIO unit **as a beneficiary** never sees 460 service prices. 996 fees apply to radiology only; other co-payments come from decrees **not** in this file (282/1975, 769/2009 and its regulations, both cited in 996's preamble). | H |
| RX-4 | A non-insured person (cash, contracted entity or foreigner) never pays 996 fees. They pay full 460 prices with the 460 modifiers. | H |
| RX-5 | 460 Art. 1/6 ("cancels anything conflicting") does **not** cancel 996, because they cover different populations and fee types. | M 0.8 |

---

## 3.5 Final-sweep additions (rules found on the last full pass)

This pass re-checked every free-text field in both files: decree articles, ch.1 provisions, ch.2 notes, includes/excludes lists, footnotes, `price_note`, `unit`, `description`, `subsection`, and item names carrying rule words (بدون/غير شامل/شامل/فقط/إضافي/تالية/متكرر/استكمال/متابعة/بحد أقصى/لكل/Each/بالفراش/ناحيتين).

### Pricing modifiers

| ID | Rule | Conf. |
|---|---|---|
| R460-M1b | **Foreigner ×2 on cost-based items.** Art.4 doubles "الأسعار الواردة بهذا القرار" (the prices stated in this decree). Drugs, supplies, implants, dye and purchased blood have **no stated price**, only a formula (cost + %). Literal reading: double the **listed prices** only, and cost-based items stay at cost + markup. The other reading is to double the whole bill. | L 0.5 |
| R460-M1c | **Foreigner ×2 and room-class difference:** room difference is for insured people, who are Egyptian scheme members, so this case should not arise. If it does, double the room price. | L |
| R460-W7 | **Deposit scope:** the deposit rules (W3/W4) are written under "private cases" only. **Contracted entities** are billed monthly with **no deposit**. Beneficiaries pay a deposit only for the room difference. | M 0.75 |
| R460-W8 | A **referral from an HIO hospital doctor** (ch.1 §2أ) is the entry point for the **"حالة طبيب"** surgical rule (O7). A referral from the outpatient clinic is a **"حالة مستشفى"** case (O6). | M 0.7 |

### Item-level pricing patterns (they apply across chapters)

| ID | Pattern | Rule | Conf. |
|---|---|---|---|
| R460-Q1 | **Follow-on / reduced items:** "متكرر" (repeat): Der-002/004/008; "يوم إضافى" (extra day): Holter Card.-004; "تالية" (subsequent): I.Rad-007 vertebra; "إضافية" (additional): I.Rad-012 lesion; "استكمال البند السابق" (completion of the previous item): MRI-076/077; "/ متابعة" (follow-up): Aud-007, Aud-026. | Charge these **only together with, or after, the base item**: `base + n × follow-on`. Never return them as the price of a single service. | H |
| R460-Q2 | **Bedside / mobile variants** (بالفراش, متنقلة): US-008, I.Rad-064/069/071/073; mobile echo on ward/ICU 500 vs NICU 700. | Pick by patient location. Bedside is sometimes **cheaper** (I.Rad-069 1050 vs 1350), so don't assume a surcharge. | H |
| R460-Q3 | **"(سعر التركيب فقط)" (insertion price only)**: CVP, Mahurkar, ETT, chest tube, epidural. | The device or catheter is extra at supply + 10 %. | H |
| R460-Q4 | **"(شامل)" (inclusive)** clinic surgical items: Surg-002…005. | The price includes local anesthesia and the consumables of the procedure. Do not add supplies. | M 0.7 |
| R460-Q5 | **Caps inside items:** ward ABG **max 6 tests/day** at 100 each (so ≤ 600/day). In ICU/intermediate/incubator, ABG is included (I6). | H |
| R460-Q6 | **Ventilator on ward includes oxygen** ("شامل الاكسجين", 600/12 h). Don't add the oxygen hourly rate while the patient is ventilated. ER ventilator (300/12 h) does **not** say it includes oxygen, so ER-014 nasal oxygen may be added. | H / M |
| R460-Q7 | **Ch.2 equipment table applies hospital-wide** ("بكل أقسام المستشفى", in every hospital department): pumps, mattresses, IABP, anti-DVT device etc. are charged wherever used. **Exception:** a department with its own price takes it (chest unit air mattress 50, see T2). | M 0.75 |
| R460-Q8 | **Per-unit lab items:** "Each" or "for each": Factor Assay, Immunophenotyping CDs, IHC marker. Price × count. | H |
| R460-Q9 | **Pathology specimen size:** ≤ 2 cm³ → 100 (Lab.-348); > 2 cm³ → 150 (Lab.-349). | H |
| R460-Q10 | **Bilateral operations.** The catalog lists some bilateral operations as their own item (ENT bilateral fistula, nasal polyps both sides, bilateral jaw, bilateral oophorectomy…). Use the bilateral item and **do not** apply the multi-operation rule O4 to left + right. If no bilateral item exists, the text is silent: O4 (same specialty, second side at 50 %) is the closest rule. | H / L 0.5 |
| R460-Q11 | **Packages and bundles by count or time:** Gyn-005/006 pregnancy follow-up = **6 visits**; Spe-004 group speech therapy = **1 month (3×/week)**; Spe-006 = **6 months**; Ph.Th-028 = 6 sessions, Ph.Th-029 = 12; radiotherapy weeks = 5 sessions; SDP 6 or 12 units. Price per bundle, not per session. | H |
| R460-Q12 | **Room descriptions are eligibility facts:** Second class = 2-patient room. Special insurance-class = 3–6-patient room "**if occupancy allows**", so availability is not guaranteed. | H |
| R460-Q13 | **Clinic item "OP-001" is shared by GP clinic and ER resident** (same 100). The ER has no separate specialist or consultant exam. Assume OP-002/003 apply when a specialist or consultant sees an ER patient. | M 0.6 |

### 996 additions

| ID | Rule | Conf. |
|---|---|---|
| R996-S4 | **Interventional radiology column label changes.** In that section the retention column is labelled "قانون 79 والمرأة المعيلة" (law 79 and female breadwinners; pensioners and widows are dropped). The cells are empty (0) anyway, so there is no price effect. | H (no effect) |
| R996-S5 | **Legal basis** includes board minutes 8/2008 and 146/2009 and decrees 769/2009 and 855/2009. Those are where the **non-radiology** beneficiary fees live (see PC-B11). | H |
| R996-S6 | CT row 13 "فيلم عظام + D3" (bone film + 3D) = 3 films. It is a 3D bone reconstruction add-on with no 460 equivalent name. Map to CT-017/018/020 "ثلاثي الابعاد" (three-dimensional) items by body part. | L 0.5 |

### Things checked and confirmed absent from both files
- No age definition of "طفل" (child) for pricing (only < 12 for companions).
- No VAT/tax, no rounding rule (all prices are integers), no weekend or night surcharge, no urgent surcharge except NAT (BB-013).
- No rule for an **HIO employee's own** discount, retired HIO staff, or second-degree relatives.
- No co-payment rule for beneficiaries outside radiology (needs 282/1975 and 769/2009).
- No issue date for 460, no meal price, no dye unit prices.

---

## 4. Decision flow for a "price for my class" query

```
INPUT: service query, payer class, nationality, context (dept / inpatient / ER / clinic),
       laterality/quantity, case type (hospital/doctor case), family-of-HIO-staff flag

1. Resolve payer class
   ├─ Insured beneficiary (G-WF/G-FB/G-ST/G-CH)?
   │    ├─ service is radiology → apply 996 (R996-F1..F5, T1/T2), base via RX-1
   │    ├─ room upgrade        → RX-2
   │    └─ else                → "co-payment governed by decrees not in this dataset" (RX-3)
   └─ Non-insured (cash / contracted entity / foreigner) → 460 path

2. 460 path
   a. Resolve item using context (R460-T1, T2); laterality/quantity (K6, L2, X3)
   b. If surgery: catalog grade → matrix total (O1); apply O4/O5 for multi-op;
      if "doctor case" show OR-only (O7); add stay ≥1 day + implants +15% + special-equipment (O2/O3)
   c. If package (ch.4) / cath (ch.7) / dialysis (ch.5): attach inclusions/exclusions (P*, C*, D*)
   d. Attach add-on hints: dye +10% (X1), consumables (E2/E3), anesthesia (A1, G2)
   e. Modifiers: ×2 foreigner (M1, except M1a) → −50% staff family (M2) → +15% admin (M4, scope flag M4a)
   f. Attach confidence = min(confidence of every rule used)
```
