/* ==========================================================================
   EDIT ME — this is the ONLY file you need to change to personalise the site.
   Everything on the page (names, texts, links) comes from here.
   Placeholders you can use inside texts:  {name}  {company}  {date}
   ========================================================================== */
window.FAREWELL = {
  name: { en: 'Ibrahim', ar: 'إبراهيم' },
  company: 'Prime Tech Solution',
  lastDay: '2026-09-30', // YYYY-MM-DD, shown on the hero

  // Company logo. To use the real one: copy it into the assets/ folder
  // (e.g. assets/logo.png) and change this path to 'assets/logo.png'.
  logo: 'assets/logo.svg',

  // Leave a link empty ('') to hide its button.
  contacts: {
    github: 'https://github.com/Srorking',
    linkedin: '',
    email: '',
    whatsapp: '', // e.g. 'https://wa.me/963XXXXXXXXX'
  },

  // Names on the 3D "Wall of thanks" sphere (taken from the team chat).
  // Fix any spelling here. A name can also be { en: 'Ahmad', ar: 'أحمد' }.
  people: [
    'Ahmadalhussein', 'Ali Asaad', 'Amenah Zaitoun', 'Bayan Derbas', 'Dima Kouli',
    'Fuad Kiwan', 'Hozaifa Alshaheen', 'Jawdat', 'Kamel Al-Samra', 'Lilas Yasmineh',
    'Liliaalbakri', 'Mohammad Issa', 'Mohammad Issawi', 'MonaSoliman', 'Raghad',
    'Salam 3yash', 'Sara Akkad', 'Tarek AlHabbal', 'Yamen Alsharaa', 'Yasser',
    'ZainaAlmasri', 'Ali Shamma', 'Mohammed', 'Salam Ezoo',
  ],

  // Names shown as glowing chips inside the special Team AI section.
  // Empty = the chips row is hidden. Example: ['Yamen Alsharaa', 'Ali Asaad']
  aiTeam: [],

  // Big multilingual "thank you" band between sections.
  band: ['Thank you', 'شكراً', 'Merci', 'Danke', 'Gracias', 'Grazie', 'Teşekkürler', 'Obrigado', 'Спасибо', 'ありがとう', '谢谢', '감사합니다'],

  text: {
    en: {
      brand: 'Ibrahim',
      nav: { journey: 'Journey', thanks: 'Thank you', wall: 'Wall of thanks', ai: 'Team AI', message: 'My note' },
      hero: {
        eyebrow: "{name}'s last day · {date}",
        title1: 'Thank you,',
        title2: 'Prime Tech family.',
        sub: "Today is my last day at {company}. It was never just a job — it was people, late nights, shared lunches, and lessons I'll carry for the rest of my career.",
        cta1: 'Read my note',
        cta2: 'Send some love',
        scroll: 'Scroll',
      },
      journey: {
        eyebrow: 'The journey',
        title: 'From my first day to my last.',
        items: [
          { k: 'Day one', t: 'Nervous, curious, welcomed', d: 'A new place, new faces — and a team that made me feel welcome from the very start.' },
          { k: 'Learning', t: 'Every bug was a lesson', d: 'Code reviews, patient explanations and “let me show you” moments turned confusion into confidence.' },
          { k: 'Growing', t: 'Building things together', d: 'Shipping features, fixing things at the last minute, and laughing about it right after.' },
          { k: 'Today', t: 'New chapter, same friendships', d: 'The desk changes. The people who shaped me stay with me, wherever I go.' },
        ],
      },
      thanks: {
        eyebrow: 'To all of you',
        title: 'Thank you for making it feel like home.',
        lead: 'Each of you gave me something different. This is what I am grateful for.',
        cards: [
          { icon: 'compass', t: 'Managers & Leaders', d: 'For trusting me with real work, guiding me when I was stuck, and pushing me past what I thought I could do.' },
          { icon: 'code', t: 'My Teammates', d: 'For the code reviews, the patient explanations, the late-night fixes, and every “don’t worry, I’ve got you.”' },
          { icon: 'heart', t: 'My Friends', d: 'For the laughs, the coffee breaks, the honest advice — and for making the hardest days feel light.' },
          { icon: 'spark', t: 'Everyone Else', d: 'HR, admin, support, and all the quiet work behind the scenes that keeps us running. I noticed. Thank you.' },
        ],
      },
      wall: {
        eyebrow: 'The wall of thanks',
        title: 'Every name here made a difference.',
        hint: 'Drag to spin the sphere',
        note: "Can't find your name? Blame my last-day brain — you're in here too, I promise.",
      },
      ai: {
        eyebrow: 'A special one',
        title1: 'Team AI,',
        title2: 'you changed how I think.',
        lead: 'To the people who turn ideas into intelligence — thank you for the experiments, the failed runs, the small breakthroughs, and for never treating a question as a silly one.',
        cmd: '$ thank --team "AI" --from "{name}"',
        lines: [
          ['loading memories', 'done'],
          ['prompts tested', 'too many to count'],
          ['coffee consumed', '∞'],
          ['hallucinations', '0 (all words true)'],
          ['gratitude accuracy', '99.99%'],
        ],
        out: '“You taught me that the smartest system is still a team that shares what it knows.”',
        cards: [
          { icon: 'spark', t: 'Stay curious', d: 'Every “what if?” was welcome, and half of them turned into something real.' },
          { icon: 'code', t: 'Ship, then improve', d: 'Experiment fast, measure honestly, iterate — and never fear a failed run.' },
          { icon: 'heart', t: 'Intelligence is teamwork', d: 'The best models I saw were built by people who shared, reviewed and helped each other.' },
        ],
        tag: 'Trained on late nights, curiosity & good people',
        members: 'The minds behind the machines',
      },
      message: {
        eyebrow: 'A note from me',
        title: 'One last message.',
        paras: [
          'To everyone at {company},',
          'Today is my last day, and I wanted to say thank you in a way that is bigger than a chat message.',
          'You welcomed me, taught me, corrected me, and believed in me while I was still learning. Every code review, every “try it this way”, every laugh in the middle of a deadline made me a better engineer and a better person.',
          "I'm leaving with real skills, real friends and real gratitude. The desk changes — the friendship doesn't.",
          "Keep building great things. I'll be your biggest fan.",
        ],
        sign: '— {name}',
      },
      finale: {
        eyebrow: 'This is not goodbye',
        title1: 'See you around,',
        title2: 'friends.',
        sub: 'Stay in touch — my door, my inbox and my GitHub are always open.',
        love: 'Send some love',
        top: 'Back to top',
        toast: 'Love sent. Received with a big smile.',
        links: { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email', whatsapp: 'WhatsApp' },
      },
      footer: 'Built with care by {name} · last day at {company} · endless thanks.',
      loading: 'Loading the thank-you…',
    },

    ar: {
      brand: 'إبراهيم',
      nav: { journey: 'الرحلة', thanks: 'شكراً لكم', wall: 'جدار الشكر', ai: 'فريق الذكاء الاصطناعي', message: 'رسالتي' },
      hero: {
        eyebrow: 'آخر يوم لي · {date}',
        title1: 'شكراً لكم،',
        title2: 'عائلة Prime\u00A0Tech.',
        sub: 'اليوم هو آخر يوم لي في {company}. لم تكن مجرد وظيفة، بل كانت أشخاصاً، وليالي طويلة، ووجبات مشتركة، ودروساً سأحملها معي طوال مسيرتي.',
        cta1: 'اقرأ رسالتي',
        cta2: 'أرسل بعض الحب',
        scroll: 'مرّر للأسفل',
      },
      journey: {
        eyebrow: 'الرحلة',
        title: 'من يومي الأول إلى يومي الأخير.',
        items: [
          { k: 'اليوم الأول', t: 'توتّر وفضول وترحيب دافئ', d: 'مكان جديد ووجوه جديدة، وفريق جعلني أشعر بالترحيب منذ اللحظة الأولى.' },
          { k: 'التعلّم', t: 'كل خطأ برمجي كان درساً', d: 'مراجعات الكود، والشرح الصبور، ولحظات «تعال أريك» حوّلت الحيرة إلى ثقة.' },
          { k: 'النمو', t: 'نبني الأشياء معاً', d: 'إطلاق ميزات، وإصلاح أمور في اللحظة الأخيرة، ثم الضحك عليها بعد ذلك مباشرة.' },
          { k: 'اليوم', t: 'فصل جديد، والصداقات كما هي', d: 'المكتب يتغيّر، أما الأشخاص الذين صنعوني فيبقون معي أينما ذهبت.' },
        ],
      },
      thanks: {
        eyebrow: 'لكل واحد منكم',
        title: 'شكراً لأنكم جعلتموه يبدو كالبيت.',
        lead: 'كلٌّ منكم أعطاني شيئاً مختلفاً، وهذا ما أشكركم عليه.',
        cards: [
          { icon: 'compass', t: 'المدراء والقادة', d: 'لأنكم وثقتم بي في عمل حقيقي، وأرشدتموني حين تعثّرت، ودفعتموني لأتجاوز حدود ما ظننته ممكناً.' },
          { icon: 'code', t: 'زملائي في الفريق', d: 'على مراجعات الكود، والشرح بصبر، وإصلاحات آخر الليل، وعلى كل «لا تقلق، أنا معك».' },
          { icon: 'heart', t: 'أصدقائي', d: 'على الضحكات، واستراحات القهوة، والنصيحة الصادقة، وعلى جعل أصعب الأيام خفيفة.' },
          { icon: 'spark', t: 'وكل من تبقّى', d: 'الموارد البشرية، والإدارة، والدعم، وكل العمل الهادئ خلف الكواليس الذي يبقينا نعمل. لاحظتُه، وأشكركم.' },
        ],
      },
      wall: {
        eyebrow: 'جدار الشكر',
        title: 'كل اسم هنا صنع فرقاً.',
        hint: 'اسحب لتدوير الكرة',
        note: 'لم تجدوا اسمكم؟ الذنب على ذهني في آخر يوم — اسمكم هنا أيضاً، أعدكم.',
      },
      ai: {
        eyebrow: 'شيء خاص',
        title1: 'فريق الذكاء الاصطناعي،',
        title2: 'غيّرتم طريقة تفكيري.',
        lead: 'إلى من يحوّلون الأفكار إلى ذكاء: شكراً على التجارب، وعلى المحاولات الفاشلة، وعلى الاختراقات الصغيرة، وعلى أنكم لم تعتبروا أي سؤال سؤالاً سخيفاً.',
        cmd: '$ thank --team "AI" --from "{name}"',
        lines: [
          ['loading memories', 'done'],
          ['prompts tested', 'too many to count'],
          ['coffee consumed', '∞'],
          ['hallucinations', '0 (all words true)'],
          ['gratitude accuracy', '99.99%'],
        ],
        out: '«علّمتموني أن أذكى نظام هو فريق يتشارك ما يعرفه.»',
        cards: [
          { icon: 'spark', t: 'ابقوا فضوليين', d: 'كل «ماذا لو؟» كان مرحّباً به، ونصفها تحوّل إلى شيء حقيقي.' },
          { icon: 'code', t: 'أطلق ثم حسّن', d: 'جرّب بسرعة، وقِس بصدق، وكرّر — ولا تخف من تجربة فاشلة.' },
          { icon: 'heart', t: 'الذكاء عمل جماعي', d: 'أفضل النماذج التي رأيتها بناها أشخاص يتشاركون ويراجعون ويساعدون بعضهم.' },
        ],
        tag: 'تدرّب على ليالٍ طويلة، وفضول، وناس طيبين',
        members: 'العقول خلف الآلات',
      },
      message: {
        eyebrow: 'رسالة مني',
        title: 'رسالة أخيرة.',
        paras: [
          'إلى كل من في {company}،',
          'اليوم هو آخر يوم لي، وأردت أن أقول لكم شكراً بطريقة أكبر من رسالة عابرة في المحادثة.',
          'لقد رحّبتم بي، وعلّمتموني، وصحّحتم لي، وآمنتم بي وأنا ما زلت أتعلّم. كل مراجعة كود، وكل «جرّب بهذه الطريقة»، وكل ضحكة في وسط ضغط التسليم جعلتني أفضل، مهنياً وإنسانياً.',
          'أغادر ومعي مهارات حقيقية، وأصدقاء حقيقيون، وامتنان كبير. المكتب يتغيّر… أما الصداقة فلا.',
          'واصلوا بناء أشياء عظيمة. سأبقى أشجّعكم دائماً.',
        ],
        sign: '— {name}',
      },
      finale: {
        eyebrow: 'هذا ليس وداعاً',
        title1: 'نلتقي قريباً،',
        title2: 'يا أصدقاء.',
        sub: 'ابقوا على تواصل — بابي، وبريدي، وحسابي على GitHub مفتوحة دائماً.',
        love: 'أرسل بعض الحب',
        top: 'العودة للأعلى',
        toast: 'وصل الحب، واستُقبل بابتسامة كبيرة.',
        links: { github: 'GitHub', linkedin: 'LinkedIn', email: 'البريد', whatsapp: 'واتساب' },
      },
      footer: 'صُنع بحب بواسطة {name} · آخر يوم في {company} · شكراً على كل شيء.',
      loading: 'جارٍ تحميل الشكر…',
    },
  },
};
