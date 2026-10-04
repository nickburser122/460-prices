window.Engine = (() => {
  const RULES = {};
  window.HIO_RULES.forEach(r => { RULES[r.id] = r; });

  const DIAC = /[\u064B-\u065F\u0670\u0640]/g;
  const AR_DIG = '٠١٢٣٤٥٦٧٨٩';
  const FA_DIG = '۰۱۲۳۴۵۶۷۸۹';

  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().replace(DIAC, '')
      .replace(/[\u200B-\u200F\u202A-\u202E]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/[ىیۍێ\u064A]/g, 'ي').replace(/[کك]/g, 'ك').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(/[٠-٩]/g, d => AR_DIG.indexOf(d)).replace(/[۰-۹]/g, d => FA_DIG.indexOf(d))
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function stem(t) {
    if (t.length > 4 && t.startsWith('لل')) return t.slice(2);
    if (t.length > 4 && /^(وال|بال|كال|فال)/.test(t)) return t.slice(3);
    if (t.length > 3 && t.startsWith('ال')) return t.slice(2);
    return t;
  }
  function tokens(s) { return norm(s).split(' ').filter(Boolean).map(stem); }
  function codeKey(c) { return String(c || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function codeKeyZ(c) { return codeKey(c).replace(/([a-z])0+(\d)/g, '$1$2'); }
  const round1 = n => Math.round(n * 10) / 10;
  const round2 = n => Math.round(n * 100) / 100;

  const TIERS = [
    { id: 'cash', group: 'non', en: 'Egyptian · cash', ar: 'مصري · بأجر', hint_en: 'Printed price', hint_ar: 'السعر المطبوع' },
    { id: 'foreign', group: 'non', en: 'Foreigner', ar: 'أجنبي', hint_en: '×2', hint_ar: '×٢' },
    { id: 'contract', group: 'non', en: 'Contracted entity', ar: 'جهة متعاقدة', hint_en: 'Billed monthly', hint_ar: 'محاسبة شهرية' },
    { id: 'family', group: 'non', en: 'HIO staff family', ar: 'أسر العاملين', hint_en: 'First degree, −50%', hint_ar: 'الدرجة الأولى، −٥٠٪' },
    { id: 'staff', group: 'ins', g996: 'wf', en: 'HIO staff', ar: 'العاملون بالهيئة', hint_en: 'As workforce', hint_ar: 'كالقوى العاملة' },
    { id: 'wf', group: 'ins', g996: 'wf', en: 'Insured · workforce', ar: 'منتفع · قوى عاملة', hint_en: 'Employees, pensioners, widows', hint_ar: 'موظفون ومعاشات وأرامل' },
    { id: 'fb', group: 'ins', g996: 'fb', en: 'Insured · female breadwinner', ar: 'منتفعة · المرأة المعيلة', hint_en: 'Law 23/2012', hint_ar: 'قانون ٢٣ لسنة ٢٠١٢' },
    { id: 'st', group: 'ins', g996: 'st', svc: true, en: 'Insured · school student', ar: 'منتفع · طلبة المدارس', hint_en: 'Law 99/1992', hint_ar: 'قانون ٩٩ لسنة ١٩٩٢' },
    { id: 'ch', group: 'ins', g996: 'ch', svc: true, en: 'Insured · pre-school child', ar: 'منتفع · دون السن المدرسي', hint_en: 'Law 86/2012', hint_ar: 'قانون ٨٦ لسنة ٢٠١٢' },
    { id: 'wi', group: 'ins', g996: null, en: 'Work injury / comprehensive', ar: 'إصابات العمل / العلاج الشامل', hint_en: 'Room difference only', hint_ar: 'فروق الإقامة فقط' }
  ];
  const TIER = {};
  TIERS.forEach(t => { TIER[t.id] = t; });

  const MOD = {
    plain: { rate: 4, sec: 'plain_xray' }, panorama: { rate: 4, sec: null }, barium: { rate: 4, sec: null },
    mammography: { rate: 5, sec: 'mammography' }, ct: { rate: 8, sec: 'ct' }, digital: { rate: 8, sec: 'digital_xray' },
    mri: { rate: 12, sec: 'mri' }, interventional: { rate: 0, sec: 'interventional' },
    us: { rate: 0, sec: null }, doppler: { rate: 0, sec: null }, nuclear: { rate: null, sec: null }
  };
  const SEC_MOD = { plain_xray: 'plain', mammography: 'mammography', ct: 'ct', digital_xray: 'digital', mri: 'mri', interventional: 'interventional' };
  const MOD_LABEL = {
    plain: ['Plain X-ray', 'أشعة عادية'], panorama: ['Panorama', 'بانوراما'], barium: ['Barium study', 'باريوم'],
    mammography: ['Mammogram / scanogram', 'ماموجرام / سكانوجرام'], ct: ['CT', 'مقطعية'], digital: ['Digital X-ray', 'ديجيتال'],
    mri: ['MRI', 'رنين'], interventional: ['Interventional', 'تداخلية'], us: ['Ultrasound', 'موجات صوتية'], doppler: ['Doppler', 'دوبلر'], nuclear: ['Nuclear medicine', 'مسح ذري']
  };

  const SYN = {
    ct: ['مقطعيه'], 'c t': ['مقطعيه'], mri: ['رنين'], mr: ['رنين'], xray: ['اشعه'], 'x-ray': ['اشعه'], x: ['اشعه'], ray: ['اشعه'], radiology: ['اشعه'],
    ultrasound: ['موجات'], sono: ['موجات'], sonar: ['موجات'], echo: ['موجات صوتيه علي القلب', 'echo'], doppler: ['دوبلر'], mammogram: ['ماموجرام'], mammo: ['ماموجرام'],
    panorama: ['بانوراما'], barium: ['باريوم'], contrast: ['صبغه'], dye: ['صبغه'], cath: ['قسطره'], catheter: ['قسطره'], angiography: ['قسطره', 'شرايين'],
    icu: ['رعايه مركزه'], ccu: ['رعايه'], nicu: ['حضانات', 'مبتسرين'], incubator: ['حضانات'], room: ['اقامه', 'درجه'], stay: ['اقامه'], suite: ['جناح'], ward: ['اقامه'],
    companion: ['مرافق'], dialysis: ['غسيل'], endoscopy: ['منظار'], scope: ['منظار'], laparoscopic: ['منظار'], laparoscopy: ['منظار'], colonoscopy: ['قولون'], ercp: ['مراريه', 'ercp'],
    biopsy: ['عينه'], cast: ['جبس', 'جبيره'], splint: ['جبيره'], dental: ['اسنان'], tooth: ['اسنان', 'سنه'], teeth: ['اسنان'], denture: ['طقم'],
    eye: ['عين', 'رمد'], eyes: ['عينين'], ear: ['اذن'], nose: ['انف'], throat: ['حنجره', 'بلعوم'], heart: ['قلب'], cardiac: ['قلب'], brain: ['مخ'], head: ['جمجمه', 'مخ'], skull: ['جمجمه'],
    chest: ['صدر'], lung: ['رئه', 'صدر'], abdomen: ['بطن'], pelvis: ['حوض'], knee: ['ركبه'], hip: ['فخذ'], shoulder: ['كتف'], spine: ['فقرات'], neck: ['رقبه', 'عنقيه'], hand: ['يد'], foot: ['قدم'],
    kidney: ['كلي', 'كلوي'], renal: ['كلوي'], bladder: ['مثانه'], urinary: ['مسالك'], liver: ['كبد'], gallbladder: ['مراره'], cholecystectomy: ['مراره'], appendix: ['زائده'], appendectomy: ['زائده'],
    hernia: ['فتق'], cesarean: ['قيصريه'], caesarean: ['قيصريه'], csection: ['قيصريه'], delivery: ['ولاده'], birth: ['ولاده'], uterus: ['رحم'], hysterectomy: ['رحم'], ovary: ['مبيض', 'مبايض'], pregnancy: ['حمل'],
    tonsil: ['لوز'], tonsillectomy: ['لوز'], cataract: ['مياه بيضاء', 'مياه بيضا'], glaucoma: ['جلوكوما', 'مياه زرقاء'], thyroid: ['درقيه', 'thyroid'], breast: ['ثدي'],
    blood: ['دم', 'blood'], plasma: ['بلازما', 'plasma'], transfusion: ['نقل دم', 'transfusion'], exam: ['كشف'], consult: ['كشف', 'استشاري'], consultation: ['كشف'], visit: ['كشف', 'زياره'], specialist: ['اخصائي'], consultant: ['استشاري'], gp: ['ممارس'],
    report: ['تقرير'], ambulance: ['اسعاف'], oxygen: ['اكسجين'], ventilator: ['تنفس صناعي'], nebulizer: ['نيبوليزر'], ecg: ['رسم قلب'], ekg: ['رسم قلب'], physio: ['علاج طبيعي'], physiotherapy: ['علاج طبيعي'],
    speech: ['تخاطب'], hearing: ['سمع', 'سمعيات'], audiology: ['سمعيات'], psychiatry: ['نفسيه'], neurology: ['اعصاب'], dermatology: ['جلديه'], skin: ['جلد'],
    transplant: ['زراعه', 'زرع'], implant: ['زراعه', 'تركيب'], cochlear: ['قوقعه'], stent: ['دعامه'], balloon: ['بالون'], valve: ['صمام'], pacemaker: ['منظم'], tavi: ['tavi'],
    pet: ['بوزيتروني', 'pet'], nuclear: ['مسح ذري'], scan: ['مسح', 'اشعه'], radiotherapy: ['اشعاعي'], radiation: ['اشعاعي'], chemotherapy: ['كيماوي'], oncology: ['اورام'], tumor: ['ورم'], tumour: ['ورم'],
    anesthesia: ['تخدير'], anaesthesia: ['تخدير'], sedation: ['تخدير'], fracture: ['كسر'], wound: ['جرح', 'غيار'], dressing: ['غيار'], suture: ['غرز', 'خياطه'], injection: ['حقن'], abscess: ['خراج'],
    surgery: ['عمليه', 'جراحه'], operation: ['عمليه'], lithotripsy: ['تفتيت'], eswl: ['تفتيت'], stone: ['حصوه', 'حصوات'], pain: ['الام', 'الالام'],
    cbc: ['cbc', 'blood count'], sugar: ['glucose', 'سكر'], glucose: ['glucose', 'سكر']
  };
  const SYN_AR = {
    'صوره دم': ['cbc'], 'سكر': ['glucose', 'سكر'], 'تحليل': ['lab'], 'غده': ['غده', 'غدد'], 'مرارة': ['مراره'], 'قيصري': ['قيصريه'], 'اشعه عاديه': ['اشعه']
  };

  let docs = [], byId = {}, rows996 = [], sections = [], MATRIX = {}, D460 = null, D996 = null;

  const FLAG_DEFS = [
    { re: /(متكرر|يوم اضافي|تاليه|اضافيه بدون|استكمال|\/ ?متابعه|اي وضع اضافي)/, rule: 'R460-Q1', key: 'addon' },
    { re: /(بدون (ثمن|سعر)|غير شامل (سعر|ثمن)|يضاف سعر)/, rule: 'R460-G1', key: 'excl' },
    { re: /سعر التركيب فقط/, rule: 'R460-Q3', key: 'insertion' },
    { re: /بدون (مستهلكات|ادويه|مستلزمات)/, rule: 'R460-E3', key: 'consum' },
    { re: /(بالفراش|بافراش|متنقله)/, rule: 'R460-Q2', key: 'bedside' },
    { re: /(\(each\)|for each|لكل )/i, rule: 'R460-L2', key: 'each' },
    { re: /(جهه واحده|جهتين|الجهتين|ناحيه واحده|ناحيتين|العين الواحده|العينين|الثدي الواحد|الثديين|جانب واحد|جانبين)/, rule: 'R460-K6', key: 'side' }
  ];
  function lightAr(s) { return String(s || '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(DIAC, '').toLowerCase(); }

  function ctxRulesFor(d) {
    const out = [];
    const a = (...ids) => ids.forEach(i => out.push(i));
    const n = d.n;
    if (d.src === 'op') {
      a('R460-O1', 'R460-O2', 'R460-O4', 'R460-O5', 'R460-O7', 'R460-O11');
      if (d.tId === 'ops-t04') a('R460-O10');
      return out;
    }
    switch (d.ch) {
      case 'c02':
        if (d.tId === 'c02-t01') {
          a('R460-I1', 'R460-I2', 'R460-I5');
          if (d.id === 'c02-t01-005') a('R460-I2b');
          if (/c02-t01-00[789]/.test(d.id)) a('R460-I6', 'R460-I7');
        } else {
          a('R460-Q7');
          if (d.id === 'c02-t02-001') a('R460-I14');
          if (d.id === 'c02-t02-002') a('R460-Q6');
          if (d.id === 'c02-t02-009') a('R460-Q5');
        }
        break;
      case 'c03': a('R460-O3'); break;
      case 'c04': a('R460-P1', 'R460-P2', 'R460-P4', 'R460-P5', 'R460-P6'); break;
      case 'c05': a('R460-D1'); if (d.id === 'c05-t01-005') a('R460-D2'); break;
      case 'c06': a('R460-G2'); break;
      case 'c07': if (d.tId === 'c07-t01') a('R460-C1', 'R460-C2', 'R460-C3', 'R460-C4'); else a('R460-C7'); if (/tavi|crt/.test(n) || d.code === 'CTH-012' || d.code === 'CTH-018') a('R460-C5'); if (d.code === 'CTH-032') a('R460-C6'); break;
      case 'c08': if (/^Pain-03[0-3]$|^Pain-02[7-9]$/.test(d.code || '')) a('R460-A1'); if (d.code === 'Pain-032') a('R460-C6'); break;
      case 'c10': a('R460-E1', 'R460-E2'); if (d.tId === 'c10-t09') a('R460-E5'); if (d.code === 'ER-001' || d.tId === 'c10-t08') a('R460-K5'); break;
      case 'c11': if (/^NUC-01[3-8]$/.test(d.code || '')) a('R460-N2'); if (d.tId !== 'c11-t01') a('R460-N1'); break;
      case 'c12':
        if (d.tId === 'c12-t01') a('R460-K1', 'R460-K2', 'R460-K3');
        if (/c12-t0[345]/.test(d.tId)) a('R460-K5');
        if (/^DNT-03[1-5]$/.test(d.code || '')) a('R460-K4');
        if (/c12-t(1[6-9]|20)/.test(d.tId)) a('R460-K7');
        if (d.tId === 'c12-t02' && /\bشامل\b/.test(n) && !/غير شامل/.test(n)) a('R460-Q4');
        if (/^(Gyn-00[56]|Spe-00[46]|Ph\.Th-02[89])$/.test(d.code || '')) a('R460-Q11');
        break;
      case 'c13':
        if (d.tId !== 'c13-t03' && d.tId !== 'c13-t07') a('R460-X1');
        if (d.tId === 'c13-t07') a('R460-X4');
        if (d.tId === 'c13-t01') a('R460-X3');
        if (/صبغه/.test(n) && !/بدون صبغه/.test(n) && (d.tId === 'c13-t05' || d.tId === 'c13-t06')) a('R460-X2');
        if (d.tId === 'c13-t07' && /c13-t07-06[89]/.test(d.id)) a('R460-X7');
        break;
      case 'c14': a('R460-L1'); if (/c14-t06-00[12]/.test(d.id)) a('R460-Q9'); if (d.code === 'Lab.-266' || d.code === 'Lab.-267') a('R460-L3'); break;
      case 'c15': a('R460-B1'); if (/^BB-01[123]$/.test(d.code || '')) a('R460-M1a', 'R460-B2'); if (d.code === 'BB-005') a('R460-B3'); break;
    }
    return out;
  }

  function linkTok(n) {
    const STOP = new Set(['اشعه', 'علي', 'عاديه', 'او', 'و', 'من', 'مع', 'بدون', 'صبغه', 'مقطعيه', 'مقطعي', 'رنين', 'مغناطيسي', 'ديجيتال', 'سينيه', 'عضو', 'منطقه', 'واحده', 'بالصبغه', 'غده', 'عظام', 'عظمه', 'مفصل', 'وضع', 'وضعين', 'اوضاع', 'طرفين', '2', '3', '4']);
    return tokens(n).filter(t => t.length > 1 && !STOP.has(t));
  }
  const ANAT = ['فقرات', 'اوعيه', 'شرايين', 'قلب', 'مثانه', 'ثدي', 'فك', 'غسيل', 'مخ', 'بطن', 'حوض', 'صدر', 'ركبه', 'كتف', 'طرف'];
  function has(T, k) { return T.some(t => tokEq(t, k)); }
  function contrastOf(n) { if (/بدون (ال)?صبغه/.test(n)) return -1; if (/صبغه/.test(n)) return 1; return 0; }
  function tokEq(a, b) { return a === b || (a.length >= 3 && b.length >= 3 && (a.startsWith(b) || b.startsWith(a))); }
  function dice(A, B) {
    if (!A.length || !B.length) return 0;
    const used = new Set(); let m = 0;
    A.forEach(x => { const j = B.findIndex((y, i) => !used.has(i) && tokEq(x, y)); if (j >= 0) { used.add(j); m++; } });
    return (2 * m) / (A.length + B.length);
  }

  function radInfo(d) {
    if (d.src !== '460') return null;
    const n = d.n;
    const M = k => Object.assign({ mod: k }, MOD[k]);
    switch (d.tId) {
      case 'c13-t01': if (/ماموجرام/.test(n)) return M('mammography'); if (/باريوم/.test(n)) return M('barium'); return M('plain');
      case 'c13-t02': return M('digital');
      case 'c13-t03': if (/سكانوجرام/.test(n)) return M('mammography'); return M('us');
      case 'c13-t04': return M('doppler');
      case 'c13-t05': return M('ct');
      case 'c13-t06': return M('mri');
      case 'c13-t07': return M('interventional');
      case 'c12-t12': if (/مقطعيه/.test(n)) return M('ct'); if (/رنين/.test(n)) return M('mri'); if (/موجات/.test(n)) return M('us'); return null;
      case 'c12-t15': if (/بانوراما/.test(n)) return M('panorama'); return null;
      case 'c11-t01': if (/\bpet\b/.test(n)) return M('ct'); return M('nuclear');
    }
    return null;
  }

  function build(d460, d996) {
    D460 = d460; D996 = d996;
    const c03 = d460.chapters.find(c => c.id === 'c03');
    const R = c03.class_prices.rows;
    const find = (re, i) => (R.find(r => re.test(lightAr(r.service))) || R[i]).prices_egp;
    const pOr = find(/فتح/, 0), pDoc = find(/طبيب/, 1), pAn = find(/تخدير/, 2), pTot = find(/اجمالي/, 3);
    c03.class_prices.classes.forEach(cl => {
      MATRIX[cl.key] = { key: cl.key, name: cl.name, or: pOr[cl.key], doc: pDoc[cl.key], an: pAn[cl.key], total: pTot[cl.key] };
    });

    d460.chapters.forEach(ch => {
      let count = 0;
      (ch.tables || []).forEach(t => {
        (t.items || []).forEach(it => {
          const isOp = ch.id === 'ops';
          const d = {
            id: it.id, src: isOp ? 'op' : '460', ch: ch.id, chNo: ch.number, chLabel: ch.label, chTitle: ch.title, tId: t.id, tTitle: t.title,
            group: t.group || t.section || '', specialty: t.specialty || it.specialty || '', code: it.code || null, serial: it.serial,
            name: it.name || '', nameAr: it.name_ar || '', cat: it.category || '', price: it.price_egp == null ? null : it.price_egp,
            grade: it.grade || null, gradeKey: it.grade_key || null, gradePrinted: it.grade_as_printed || null,
            unit: it.unit || null, priceNote: it.price_note || null, desc: it.description || null, stay: it.stay_days || null,
            page: it.printed_page != null ? String(it.printed_page) : ((t.printed_pages || ch.printed_pages || []).filter(x => x != null).join('–') || null),
            lang: it.name_language || 'ar'
          };
          if (isOp && d.gradeKey && MATRIX[d.gradeKey]) d.price = MATRIX[d.gradeKey].total;
          finishDoc(d);
          count++;
        });
      });
      if (count) sections.push({ id: ch.id, no: ch.number, label: ch.label, title: ch.title, count, src: ch.id === 'ops' ? 'op' : '460' });
    });

    let c996 = 0;
    d996.sections.forEach(sec => {
      sec.rows.forEach(r => {
        const d = {
          id: `996-${sec.id}-${String(r.n).padStart(2, '0')}`, src: '996', ch: '996', chTitle: 'قرار ٩٩٦ لسنة ٢٠٢٠', tId: `996-${sec.id}`, tTitle: sec.title, sec: sec.id, secOrder: sec.order,
          code: null, serial: r.n, name: r.name, nameAr: '', cat: sec.title, price: null, films: r.films, ret79: r.ret79, schoolRet: r.school_ret, schoolSvc: r.school_svc, schoolTotal: r.school_total,
          page: null, lang: 'ar', retLabel: sec.ret79_group_label || null
        };
        finishDoc(d);
        rows996.push(d);
        c996++;
      });
    });
    sections.push({ id: '996', no: null, label: '996', title: 'رسوم الأشعة للمنتفعين', count: c996, src: '996' });

    const groups = {};
    docs.forEach(d => { (groups[d.key] = groups[d.key] || []).push(d); });
    docs.forEach(d => {
      const sib = (groups[d.key] || []).filter(x => x !== d);
      d.siblings = sib;
      d.conflict = sib.some(x => x.tId === d.tId && x.src === d.src && x.cat === d.cat && x.nameAr === d.nameAr && x.price !== d.price && x.price != null && d.price != null);
      d.dup = sib.some(x => x.tId === d.tId && x.price === d.price);
      d.otherCtx = sib.filter(x => x.tId !== d.tId);
      d.flags = [];
      if (d.src !== '996') {
        const la = lightAr(d.name);
        FLAG_DEFS.forEach(f => { if (f.re.test(la)) d.flags.push({ key: f.key, rule: f.rule }); });
        if (d.conflict) d.flags.push({ key: 'conflict', rule: 'R460-T3' });
        if (d.otherCtx.length && d.otherCtx.some(x => x.price !== d.price)) d.flags.push({ key: 'context', rule: 'R460-T2' });
        if (d.code && docs.some(x => x !== d && x.code === d.code && x.key !== d.key)) d.flags.push({ key: 'codeReuse', rule: 'R460-T1' });
        d.ctxRules = ctxRulesFor(d);
      } else {
        d.ctxRules = rules996For(d);
      }
      d.rad = radInfo(d);
    });

    linkAll();
    return { docs, sections, rows996 };
  }

  function rules996For(d) {
    const out = ['R996-S1', 'R996-GRP', 'R996-F1'];
    if (d.sec === 'interventional') out.push('R996-F4', 'R996-S4');
    if (d.sec === 'mri' && (d.serial === 11 || d.serial === 12)) out.push('R996-D1');
    if ((d.sec === 'mri' && [9, 10, 15, 16].includes(d.serial)) || (d.sec === 'plain_xray' && [9, 13, 22, 23].includes(d.serial))) out.push('R996-D2');
    if (d.sec === 'digital_xray' && [3, 4, 7, 8].includes(d.serial)) out.push('R996-D3');
    if (d.sec === 'plain_xray' && d.serial === 2) out.push('R996-D4');
    if (d.sec === 'ct' && d.serial === 14) out.push('R996-D5');
    if (d.sec === 'ct' && d.serial === 13) out.push('R996-S6');
    if (d.sec === 'plain_xray') out.push('R996-T1', 'R996-T2');
    return out;
  }

  function finishDoc(d) {
    d.n = norm(d.name + (d.nameAr ? ' ' + d.nameAr : ''));
    d.nameTok = tokens(d.name + ' ' + (d.nameAr || ''));
    d.ctxTok = tokens([d.cat, d.tTitle, d.group, d.chTitle, d.specialty, d.grade].filter(Boolean).join(' '));
    d.ck = codeKey(d.code); d.ckz = codeKeyZ(d.code);
    d.key = tokens(d.name).join(' ');
    if (d.src === '996') d.key = '996:' + d.key;
    docs.push(d); byId[d.id] = d;
  }

  function linkAll() {
    const bySec = {};
    rows996.forEach(r => { (bySec[r.sec] = bySec[r.sec] || []).push(r); r.lt = linkTok(r.name); r.cst = contrastOf(r.n); r.generic = /عضو واحد/.test(r.n); r.links = []; });
    docs.forEach(d => {
      if (!d.rad || !d.rad.sec) return;
      const cands = bySec[d.rad.sec] || [];
      if (d.code === 'NUC-023') {
        const row = cands.find(r => r.serial === 14);
        if (row) { d.link996 = { row, score: 1, conf: RULES['R996-D5'].c, forced: true }; row.links.push({ doc: d, score: 1 }); }
        return;
      }
      const lt = linkTok(d.name); const cst = contrastOf(d.n);
      let best = null;
      cands.forEach(r => {
        if (r.generic) return;
        let s = dice(lt, r.lt);
        if (ANAT.some(k => has(lt, k) !== has(r.lt, k))) s *= 0.6;
        if (cst !== 0 && r.cst !== 0 && cst !== r.cst) s *= 0.55;
        if (cst === 0 && r.cst === 1) s *= 0.85;
        if (!best || s > best.score) best = { row: r, score: s };
      });
      if (best && best.score >= 0.4) {
        d.link996 = { row: best.row, score: round2(best.score), conf: Math.min(0.9, round2(0.35 + 0.6 * best.score)) };
      } else {
        const gen = cands.filter(r => r.generic);
        if (gen.length) {
          const g = gen.find(r => r.cst === (cst === 1 ? 1 : -1)) || gen[0];
          d.link996 = { row: g, score: 0.5, conf: 0.5, generic: true };
        }
      }
      if (d.link996) d.link996.row.links.push({ doc: d, score: d.link996.score, generic: d.link996.generic });
    });
    rows996.forEach(r => {
      r.links.sort((a, b) => b.score - a.score || (a.doc.price || 0) - (b.doc.price || 0));
      if (!r.links.length) {
        const pool = docs.filter(d => d.rad && d.rad.sec === r.sec);
        const sc = pool.map(d => ({ doc: d, score: round2(dice(r.lt, linkTok(d.name))) })).filter(x => x.score >= 0.3).sort((a, b) => b.score - a.score).slice(0, 4);
        r.links = sc.map(x => Object.assign(x, { weak: true }));
      }
      if (r.links.length) {
        const top = r.generic ? r.links.slice().sort((a, b) => a.doc.price - b.doc.price)[0] : r.links[0];
        r.linkBase = { doc: top.doc, score: top.score, conf: top.weak ? 0.45 : (r.generic ? 0.55 : Math.min(0.9, round2(0.35 + 0.6 * top.score))) };
      }
    });
  }

  function fin(r, d) {
    const parts = r.calc.map(id => ({ id, c: RULES[id] ? RULES[id].c : 0.5 }));
    if (r.linkConf != null) parts.push({ id: 'LINK', c: r.linkConf });
    if (d && d.conflict && r.status === 'price') parts.push({ id: 'R460-T3', c: RULES['R460-T3'].c });
    r.confParts = parts;
    r.conf = parts.length ? Math.min(...parts.map(p => p.c)) : 0.5;
    r.notes = r.notes.filter(id => !r.calc.includes(id));
    return r;
  }

  function priceFor(d, tierId) {
    const T = TIER[tierId] || TIER.cash;
    const r = { status: 'price', amount: null, lines: [], calc: [], notes: [], tier: T.id };
    r.use = id => { if (!r.calc.includes(id)) r.calc.push(id); };
    r.note = id => { if (!r.notes.includes(id)) r.notes.push(id); };
    (d.flags || []).forEach(f => r.note(f.rule));
    (d.ctxRules || []).forEach(r.note);
    if (d.src === '996') return price996(d, T, r);
    if (T.group === 'ins') return priceInsured(d, T, r);
    return priceNon(d, T, r);
  }

  function priceNon(d, T, r) {
    let base, comps = null;
    if (d.src === 'op') {
      const m = MATRIX[d.gradeKey];
      if (!m) { r.status = 'na'; r.reason = 'noGrade'; r.use('R460-O8'); return fin(r, d); }
      base = m.total; comps = { or: m.or, doc: m.doc, an: m.an }; r.use('R460-O1');
      r.lines.push({ k: 'gradeTotal', amount: base, rule: 'R460-O1', grade: m.name });
    } else {
      if (d.price == null) { r.status = 'na'; r.reason = 'noPrice'; r.use('PRINT'); return fin(r, d); }
      base = d.price; r.use('PRINT');
      r.lines.push({ k: 'printed', amount: base, rule: 'PRINT' });
    }
    let amt = base, factor = 1;
    if (T.id === 'foreign') {
      if (d.ch === 'c15' && d.code === 'BB-012') { r.use('R460-M1a'); r.lines.push({ k: 'ownForeignLine', amount: 0, rule: 'R460-M1a' }); }
      else if (d.ch === 'c15' && d.code === 'BB-011') { amt = 300; r.use('R460-M1a'); r.lines.push({ k: 'useBB012', amount: 300 - base, rule: 'R460-M1a' }); }
      else { factor = 2; amt = base * 2; r.use('R460-M1'); r.lines.push({ k: 'x2', amount: base, rule: 'R460-M1' }); r.note('R460-M1b'); }
    }
    if (T.id === 'family') { factor = 0.5; amt = base * 0.5; r.use('R460-M2'); r.lines.push({ k: 'fam50', amount: -base * 0.5, rule: 'R460-M2' }); r.note('PC-R2'); r.note('R460-M3'); r.note('PC-R5'); r.note('PC-R8'); }
    if (T.id === 'contract') { r.note('R460-W1'); r.note('PC-E5'); r.note('R460-W7'); }
    if (T.id === 'cash') r.note('R460-S3');
    r.amount = amt;
    if (comps) {
      r.comps = { or: comps.or * factor, doc: comps.doc * factor, an: comps.an * factor };
      r.doctorCase = comps.or * factor;
      if (T.id === 'family') r.note('PC-R7');
    }
    const adminRule = d.ch === 'c12' ? 'R460-M4a' : 'R460-M4';
    r.admin = { amount: round2(amt * 0.15), total: round2(amt * 1.15), rule: adminRule };
    r.note(adminRule); r.note('R460-M5');
    r.unitKey = d.unit ? 'per' : null;
    return fin(r, d);
  }

  function priceInsured(d, T, r) {
    r.note('PC-B1'); r.note('PC-B2');
    if (T.id === 'staff') { r.note('PC-E4'); r.note('R460-M3'); r.note('PC-E1'); }
    if (d.rad) return priceRad(d, T, r);
    if (d.tId === 'c02-t01') {
      if (['c02-t01-001', 'c02-t01-002', 'c02-t01-003', 'c02-t01-005'].includes(d.id)) {
        r.use('PRINT'); r.use('PC-B3'); r.note('RX-2'); r.note('R460-I5');
        r.lines.push({ k: 'classPrice', amount: d.price, rule: 'PRINT' }, { k: 'insBed', amount: -50, rule: 'PC-B3' });
        r.amount = d.price - 50; r.unitKey = 'perDayDiff';
        return fin(r, d);
      }
      if (d.id === 'c02-t01-004' || d.id === 'c02-t01-006') {
        r.use('R460-I5'); r.lines.push({ k: 'insCompanion', amount: 50, rule: 'R460-I5' }); r.amount = 50; r.unitKey = 'perDay';
        return fin(r, d);
      }
      r.status = 'covered'; r.reason = 'icu'; r.use('PC-B8'); return fin(r, d);
    }
    if (d.ch === 'c10') { r.status = 'covered'; r.reason = 'er'; r.use('PC-B4'); return fin(r, d); }
    r.status = 'na'; r.reason = 'notInData'; r.use('PC-B11'); r.note('RX-3');
    return fin(r, d);
  }

  function priceRad(d, T, r) {
    const rad = d.rad;
    r.use('RX-1'); r.note('RX-1a'); r.note('R996-S3'); r.note('R996-F5'); r.note('R996-F5a'); r.note('R996-G3'); r.note('R996-GRP');
    r.radMod = rad.mod;
    if (!T.g996) { r.status = 'na'; r.reason = 'no996'; r.calc = []; r.use('PC-B13'); return fin(r, d); }
    if (rad.mod === 'nuclear') { r.status = 'na'; r.reason = 'nuclear'; r.calc = []; r.use('R996-NA'); return fin(r, d); }
    const link = d.link996;
    let films;
    if (rad.mod === 'interventional') { films = 0; r.use('R996-F4'); }
    else if (rad.mod === 'us' || rad.mod === 'doppler') { films = 0; r.use('R996-G4'); }
    else if (link && link.row.films != null) { films = link.row.films; r.linkConf = link.conf; }
    else { films = 2; r.use('R996-G1'); }
    if (link) r.link = link;
    const ret = films * rad.rate;
    r.use('R996-F1');
    r.lines.push({ k: 'retention', amount: ret, rule: 'R996-F1', films, rate: rad.rate });
    let total = ret;
    if (T.svc) {
      const svc = Math.min(20, round1(d.price * 0.1));
      r.use('R996-F2'); r.use('R996-T1');
      r.lines.push({ k: 'service', amount: svc, rule: 'R996-F2', base: d.price });
      total += svc;
      if (link && link.row.schoolTotal != null) r.printed = { amount: link.row.schoolTotal, rule: 'R996-T2', row: link.row };
    } else {
      r.use('R996-F3');
      if (link) r.printed = { amount: link.row.ret79 || 0, rule: 'R996-T2', row: link.row };
    }
    if (T.id === 'staff') r.use('PC-E4');
    r.amount = total; r.unitKey = 'copay';
    return fin(r, d);
  }

  function price996(d, T, r) {
    if (T.group !== 'ins') { r.status = 'na'; r.reason = 'rx4'; r.use('RX-4'); return fin(r, d); }
    if (!T.g996) { r.status = 'na'; r.reason = 'no996'; r.use('PC-B13'); return fin(r, d); }
    const mod = SEC_MOD[d.sec]; const rate = MOD[mod].rate;
    const films = d.films || 0; const ret = films * rate;
    r.use('R996-F1');
    r.lines.push({ k: 'retention', amount: ret, rule: 'R996-F1', films, rate });
    let total = ret;
    if (T.svc) {
      const lb = d.linkBase;
      let svc;
      if (d.sec === 'interventional') { svc = 20; r.use('R996-F4'); if (lb) svc = Math.min(20, round1(lb.doc.price * 0.1)); }
      else if (lb) { svc = Math.min(20, round1(lb.doc.price * 0.1)); r.use('R996-T1'); r.use('RX-1'); r.linkConf = lb.conf; }
      else { svc = d.schoolSvc; r.use('R996-T2'); }
      r.use('R996-F2');
      r.lines.push({ k: 'service', amount: svc, rule: 'R996-F2', base: lb ? lb.doc.price : null, baseDoc: lb ? lb.doc : null });
      total += svc;
      r.printed = { amount: d.schoolTotal, rule: 'R996-T2', svc: d.schoolSvc };
    } else {
      r.use('R996-F3');
      if (d.sec === 'interventional') r.use('R996-F4');
    }
    if (T.id === 'staff') r.use('PC-E4');
    r.amount = total; r.unitKey = 'copay';
    return fin(r, d);
  }

  function expandQuery(q) {
    const nq = norm(String(q).replace(/x[\s-]*rays?/gi, 'xray').replace(/c[\s.-]?t\b/gi, 'ct').replace(/pet[\s-]*ct/gi, 'pet ct'));
    const parts = nq.split(' ').filter(Boolean);
    const groups = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const two = i + 1 < parts.length ? p + ' ' + parts[i + 1] : null;
      if (two && SYN_AR[two]) { groups.push({ raw: two, alts: [stem(p), ...SYN_AR[two].map(norm)], phrase: two }); i++; continue; }
      const alts = [stem(p)];
      const sy = SYN[p] || SYN_AR[p];
      if (sy) sy.forEach(s => alts.push(norm(s)));
      groups.push({ raw: p, alts });
    }
    return { nq, groups };
  }

  function lev1(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, e = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++e > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return e + (a.length - i) + (b.length - j) <= 1;
  }

  function tokScore(alt, d) {
    if (alt.includes(' ')) {
      if (d.n.includes(alt)) return 3;
      const ps = alt.split(' ').map(stem);
      const all = [...d.nameTok, ...d.ctxTok];
      return ps.every(p => all.some(t => t === p || (p.length >= 2 && t.startsWith(p)))) ? 2.6 : 0;
    }
    let best = 0;
    const nt = d.nameTok;
    for (let k = 0; k < nt.length; k++) {
      const t = nt[k];
      if (t === alt) { best = 3; break; }
      if (alt.length >= 2 && t.startsWith(alt)) best = Math.max(best, 2.2);
      else if (alt.length >= 4 && t.includes(alt)) best = Math.max(best, 1.1);
      else if (alt.length >= 4 && lev1(alt, t.slice(0, alt.length + 1)) && t.length >= alt.length - 1) best = Math.max(best, 0.9);
    }
    if (best) return best;
    const ct = d.ctxTok;
    for (let k = 0; k < ct.length; k++) {
      const t = ct[k];
      if (t === alt) return 1.2;
      if (alt.length >= 3 && t.startsWith(alt)) best = Math.max(best, 0.9);
    }
    return best;
  }

  const cache = new Map();
  function search(q, opts) {
    opts = opts || {};
    const cKey = q + '|' + JSON.stringify(opts);
    if (cache.has(cKey)) return cache.get(cKey);
    let pool = docs;
    if (opts.src && opts.src !== 'all') pool = pool.filter(d => d.src === opts.src);
    if (opts.section && opts.section !== 'all') pool = pool.filter(d => d.ch === opts.section);
    if (opts.grade && opts.grade !== 'all') pool = pool.filter(d => d.gradeKey === opts.grade);
    const qTrim = String(q || '').trim();
    let res;
    if (!qTrim) {
      res = pool.map(d => ({ d, s: 0 }));
    } else {
      const { nq, groups } = expandQuery(qTrim);
      const qc = qTrim.toLowerCase().replace(/[^a-z0-9]/g, '');
      const qcz = qc.replace(/([a-z])0+(\d)/g, '$1$2');
      const hasCodeShape = /[a-z]/.test(qc) && /\d/.test(qc);
      res = [];
      const need = groups.length >= 3 ? groups.length - 1 : groups.length;
      for (let i = 0; i < pool.length; i++) {
        const d = pool[i];
        let s = 0;
        if (hasCodeShape && d.ck) {
          if (d.ck === qc || d.ckz === qcz) s += 40;
          else if (d.ck.startsWith(qc) || d.ckz.startsWith(qcz)) s += 14;
        }
        let matched = 0, sum = 0;
        for (let g = 0; g < groups.length; g++) {
          let gb = 0;
          const alts = groups[g].alts;
          for (let a = 0; a < alts.length; a++) { const v = tokScore(alts[a], d); if (v > gb) gb = v; if (gb === 3) break; }
          if (gb > 0) { matched++; sum += gb; }
        }
        if (matched < need && s < 14) continue;
        s += sum - (groups.length - matched) * 2.5;
        const padded = ' ' + d.n + ' ';
        if (nq.length > 2 && padded.includes(' ' + nq + ' ')) s += 4;
        else if (nq.length > 2 && padded.includes(' ' + nq)) s += 2;
        if (d.n.startsWith(nq)) s += 2;
        s -= d.nameTok.length * 0.04;
        if (d.src === 'op') s -= 0.15;
        if (s > 0) res.push({ d, s });
      }
    }
    res = res.map(x => {
      const p = priceFor(x.d, opts.tier || 'cash');
      const pen = p.status === 'na' ? 3 : p.status === 'covered' ? 1 : 0;
      return { d: x.d, s: x.s - pen, p };
    });
    if (opts.conf === 'high') res = res.filter(x => x.p.conf >= 0.9);
    else if (opts.conf === 'mid') res = res.filter(x => x.p.conf >= 0.6 && x.p.conf < 0.9);
    else if (opts.conf === 'low') res = res.filter(x => x.p.conf < 0.6 || x.d.conflict);
    if (opts.priced) res = res.filter(x => x.p.status === 'price');
    const min = opts.min !== '' && opts.min != null ? Number(opts.min) : null;
    const max = opts.max !== '' && opts.max != null ? Number(opts.max) : null;
    if (min != null && !isNaN(min)) res = res.filter(x => x.p.amount != null && x.p.amount >= min);
    if (max != null && !isNaN(max)) res = res.filter(x => x.p.amount != null && x.p.amount <= max);
    const order = { price: 0, covered: 1, na: 2 };
    if (opts.sort === 'asc') res.sort((a, b) => (order[a.p.status] - order[b.p.status]) || ((a.p.amount ?? 1e12) - (b.p.amount ?? 1e12)));
    else if (opts.sort === 'desc') res.sort((a, b) => (order[a.p.status] - order[b.p.status]) || ((b.p.amount ?? -1) - (a.p.amount ?? -1)));
    else if (opts.sort === 'conf') res.sort((a, b) => b.p.conf - a.p.conf || b.s - a.s);
    else if (qTrim) res.sort((a, b) => b.s - a.s);
    if (cache.size > 300) cache.clear();
    cache.set(cKey, res);
    return res;
  }

  function sourceOf(ref) {
    const [kind, arg] = ref.split(':');
    const c01 = D460.chapters.find(c => c.id === 'c01');
    const ch = id => D460.chapters.find(c => c.id === id);
    const doc460 = '460/2024';
    try {
      if (kind === 'art') { const a = D460.decree.articles[Number(arg) - 1]; let t = a.text; if (a.clauses) t += ' ' + a.clauses.map(c => c.label + ') ' + c.text).join(' '); return { where: `${doc460} · Art. ${arg}`, text: t }; }
      if (kind === 'c01') {
        const [pn, cl] = arg.split('.');
        const p = c01.provisions.find(x => String(x.number) === pn);
        if (cl) { const c = p.clauses.find(x => x.label === cl); return { where: `${doc460} · Ch.1 §${pn}${cl}`, text: (p.title ? p.title + ' ' : '') + c.text + (c.items ? ' ' + c.items.join(' · ') : '') }; }
        let t = (p.title ? p.title + ' ' : '') + (p.text || '');
        if (p.clauses) t += ' ' + p.clauses.map(c => c.label + ') ' + c.text + (c.items ? ' ' + c.items.join(' · ') : '')).join(' ');
        return { where: `${doc460} · Ch.1 §${pn}`, text: t };
      }
      if (kind === 'c02n') {
        const [pn, cl] = arg.split('.');
        const n = ch('c02').notes.find(x => String(x.number) === pn);
        if (cl) { const c = n.clauses.find(x => x.label === cl); return { where: `${doc460} · Ch.2 note ${pn}${cl}`, text: (n.title || '') + ' ' + c.text }; }
        let t = (n.title ? n.title + ' ' : '') + (n.text || '');
        if (n.clauses) t += ' ' + n.clauses.map(c => c.label + ') ' + c.text).join(' ');
        if (n.items) t += ' ' + n.items.join(' · ');
        if (n.closing_text) t += ' ' + n.closing_text;
        return { where: `${doc460} · Ch.2 note ${pn}`, text: t };
      }
      if (kind === 'item') { const d = byId[arg]; return { where: `${doc460} · ${d.chLabel || ''} · ${d.code || d.id}`, text: `${d.name} = ${d.price != null ? d.price + ' EGP' : (d.grade || '—')}${d.priceNote ? ' (' + d.priceNote + ')' : ''}${d.desc ? ' — ' + d.desc : ''}` }; }
      if (kind === 'c03matrix') { const c = ch('c03'); return { where: `${doc460} · Ch.3 grade matrix`, text: c.class_prices.rows.map(r => r.service + ': ' + c.class_prices.classes.map(k => k.name + ' ' + r.prices_egp[k.key]).join(' / ')).join(' — ') }; }
      if (kind === 'c03add') { const c = ch('c03'); return { where: `${doc460} · Ch.3 “ويضاف إليه”`, text: c.added_to_price.items.join(' · ') }; }
      if (kind === 'c04intro') { const c = ch('c04'); return { where: `${doc460} · Ch.4 intro`, text: c.intro.paragraphs[0] }; }
      if (kind === 'c04excl') { const c = ch('c04'); return { where: `${doc460} · Ch.4 exclusions`, text: c.package_exclusions.join(' · ') + ' — ' + c.intro.paragraphs[2] }; }
      if (kind === 'c05n') { const c = ch('c05'); return { where: `${doc460} · Ch.5 note`, text: c.notes[Number(arg)].text }; }
      if (kind === 'c07t1inc' || kind === 'c07t1exc' || kind === 'c07t1close' || kind === 'c07t2inc' || kind === 'c07t2exc') {
        const t = ch('c07').tables[kind.startsWith('c07t1') ? 0 : 1];
        if (kind.endsWith('inc')) return { where: `${doc460} · ${t.title} · ${t.includes.heading}`, text: t.includes.items.join(' · ') };
        if (kind.endsWith('exc')) return { where: `${doc460} · ${t.title} · ${t.excludes.heading}`, text: t.excludes.items.join(' · ') };
        return { where: `${doc460} · ${t.title}`, text: t.closing_note };
      }
      if (kind === 'c10n') { const c = ch('c10'); return { where: `${doc460} · Ch.10 note`, text: c.notes.map(n => n.text).join(' ') }; }
      if (kind === 'c12t01n') { const t = ch('c12').tables[0]; return { where: `${doc460} · Ch.12 exam fees note`, text: t.notes[Number(arg)].text }; }
      if (kind === 'c13fn') { const t = ch('c13').tables[0]; return { where: `${doc460} · Ch.13 footnote`, text: t.footnote }; }
      if (kind === 'c15n') { const c = ch('c15'); return { where: `${doc460} · Ch.15 note`, text: c.notes.map(n => n.text).join(' ') }; }
      if (kind === 'ref') return { where: `${doc460} · preamble`, text: D460.decree.references[Number(arg)] };
      if (kind === 'meta') return { where: `${doc460} · subject`, text: D460.decree.subject };
      if (kind === '996') {
        const a = D996.article_1;
        if (arg === 'a1ret') return { where: '996/2020 · Art.1 retention', text: a.retention_fee.applies_to + ' — ' + Object.entries(a.retention_fee.per_film_egp).map(([k, v]) => k + ' ' + v).join(', ') };
        if (arg === 'a1svc') return { where: '996/2020 · Art.1 service fee', text: a.service_fee.applies_to + ' — ' + a.service_fee.rule };
        if (arg === 'collect') return { where: '996/2020 · Art.1', text: a.collection_rule };
        if (arg === 'col') return { where: '996/2020 · table columns', text: Object.values(D996.columns).join(' | ') };
        if (arg === 'basis') return { where: '996/2020 · legal basis', text: D996.decision.legal_basis.filter(x => /282|769|855/.test(x)).join(' · ') };
        if (arg === 'subject') return { where: '996/2020 · subject', text: D996.decision.subject };
      }
    } catch (e) { return null; }
    return null;
  }

  function estimate(items, tierId, opt) {
    opt = opt || {};
    const T = TIER[tierId] || TIER.cash;
    const lines = [], na = [], used = new Set();
    let subtotal = 0, conf = 1, hospital = false;
    const ops = [];
    items.forEach(({ id, qty }) => {
      const d = byId[id]; if (!d) return;
      const p = priceFor(d, tierId);
      if (p.status !== 'price') { na.push({ d, p, qty }); p.calc.forEach(x => used.add(x)); return; }
      p.calc.forEach(x => used.add(x));
      conf = Math.min(conf, p.conf);
      if (d.ch !== 'c12') hospital = true;
      if (d.src === 'op' && T.group === 'non') { for (let i = 0; i < qty; i++) ops.push({ d, p }); return; }
      const amt = p.amount * qty;
      lines.push({ d, p, qty, unit: p.amount, amount: amt });
      subtotal += amt;
    });
    if (ops.length) {
      const bySpec = {};
      ops.forEach(o => { (bySpec[o.d.tId] = bySpec[o.d.tId] || []).push(o); });
      const specs = Object.keys(bySpec);
      if (specs.length > 1) used.add('R460-O5');
      specs.forEach(sp => {
        const list = bySpec[sp].sort((a, b) => b.p.amount - a.p.amount);
        list.forEach((o, i) => {
          const f = i === 0 ? 1 : i <= 2 ? 0.5 : 0;
          if (list.length > 1) { used.add('R460-O4'); conf = Math.min(conf, RULES['R460-O4'].c); }
          let unit = o.p.amount;
          if (opt.doctorCase) { unit = o.p.doctorCase; used.add('R460-O7'); }
          const amt = unit * f;
          lines.push({ d: o.d, p: o.p, qty: 1, unit, amount: amt, factor: f, doctorCase: !!opt.doctorCase });
          subtotal += amt;
        });
      });
      used.add('R460-O2');
    }
    let admin = 0, adminRule = null;
    if (T.group === 'non' && opt.admin && subtotal > 0) {
      adminRule = hospital ? 'R460-M4' : 'R460-M4a';
      admin = round2(subtotal * 0.15); used.add(adminRule); used.add('R460-M4b');
      conf = Math.min(conf, RULES[adminRule].c);
    }
    if (!lines.length) conf = na.length ? Math.min(...na.map(x => x.p.conf)) : 0;
    return { lines, na, subtotal: round2(subtotal), admin, adminRule, total: round2(subtotal + admin), conf, rules: [...used] };
  }

  function stats() {
    let tables = 0;
    D460.chapters.forEach(c => { tables += (c.tables || []).length; });
    return { priced: docs.filter(d => d.src === '460' && d.price != null).length, ops: docs.filter(d => d.src === 'op').length, r996: rows996.length, tables };
  }

  return { build, search, stats, priceFor, expandQuery, sourceOf, estimate, norm, TIERS, TIER, RULES, MATRIX, MOD_LABEL, get docs() { return docs; }, get byId() { return byId; }, get sections() { return sections; }, get rows996() { return rows996; } };
})();
