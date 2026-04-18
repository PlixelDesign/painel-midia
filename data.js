const SEED_DATA = {

  contas: [
    {
      id: '1', nome: 'Subsede São Luiz',
      handle: '@adbh_industrialsaoluiz',
      status: 'instável', responsavel: 'Daniel + Maysa',
      cadencia: 'Seg / Qua / Sex',
      bloqueio: 'Templates Canva pendentes · Equipe incompleta',
      tier: 1, cor: '#3b82f6'
    },
    {
      id: '2', nome: 'Plixel',
      handle: '@pixel_design',
      status: 'instável', responsavel: 'Daniel',
      cadencia: 'A definir',
      bloqueio: 'Gravação travada · Saves em zero',
      tier: 1, cor: '#7c6af7'
    },
    {
      id: '3', nome: 'Vocal Renascer',
      handle: 'Conjunto de Jovens',
      status: 'travado', responsavel: 'Emanuelly',
      cadencia: 'Dom pós EBD',
      bloqueio: 'Gravação parada · Aprovação pastoral pendente',
      tier: 2, cor: '#955343'
    },
    {
      id: '4', nome: 'Herança do Senhor',
      handle: 'Depto Infantil',
      status: 'estruturado', responsavel: 'A definir',
      cadencia: '—',
      bloqueio: 'Responsável não definido',
      tier: 2, cor: '#f59e0b'
    },
    {
      id: '5', nome: 'Estrela da Manhã',
      handle: 'Conjunto das Irmãs',
      status: 'aguardando', responsavel: 'A definir',
      cadencia: '—',
      bloqueio: 'Reunião esta semana',
      tier: 3, cor: '#ec4899'
    },
    {
      id: '6', nome: 'Novo Alvorecer',
      handle: 'Depto Adolescentes',
      status: 'aguardando', responsavel: 'A definir',
      cadencia: '—',
      bloqueio: 'Briefing deles pendente',
      tier: 3, cor: '#f97316'
    }
  ],

  posts: [
  {
    id: "vr_001", contaId: "3", titulo: "Até que Ele seja tudo em nós",
    formato: "reels", pilar: "ensino",
    dataplanejada: "2026-04-14", horarioplanejado: "18:00",
    legenda: "", observacoes: "POST DE LANÇAMENTO - Reel de impacto apresentando o tema do congresso. Hook forte nos primeiros 3s. Usar música reverente + moderna.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_002", contaId: "3", titulo: "Quando Deus não é tudo",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-04-16", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel 7 slides - Aprofunda o tema. Criar identificação com o vazio de fé dividida. Photoshop com paleta azul/marrom.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_003", contaId: "3", titulo: "Comunhão real - Culto no lar",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-04-21", horarioplanejado: "18:00",
    legenda: "", observacoes: "IMPORTANTE: Material captado no dia 20/04 (domingo) durante culto no lar + churras jovens. Mostrar comunhão REAL, não falada. Edição simples 30-45s.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_004", contaId: "3", titulo: "Como é viver com Cristo no centro",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-04-23", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel 7 slides - Ensino prático com 4 áreas de transformação. Template numerado (01, 02, 03, 04). Foco em aplicação.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_005", contaId: "3", titulo: "A jornada começa agora",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-04-29", horarioplanejado: "18:00",
    legenda: "", observacoes: "FECHAMENTO DE ABRIL - Recapitula posts anteriores + mobiliza para continuidade. CTA forte: compartilhar e convidar. Stories: toda equipe engaja.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_006", contaId: "3", titulo: "O que a Bíblia diz sobre Cristo ser tudo",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-05", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel com versículos-chave: Colossenses 1:15-20, Efésios 1:22-23, Filipenses 2:9-11. Design minimalista, foco no texto bíblico.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_007", contaId: "3", titulo: "Testemunho: Como Cristo mudou minha vida",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-05-08", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel com jovem do Vocal contando transformação pessoal. 45-60s. Gravar no sábado/domingo. Legendar para acessibilidade.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_008", contaId: "3", titulo: "5 sinais de que Cristo não é tudo pra você",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-12", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel diagnóstico - 5 sinais práticos. Tom: honesto mas esperançoso. Meta: 80+ salvamentos (conteúdo de referência).",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_009", contaId: "3", titulo: "Adoração em casa: bastidores",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-05-15", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel mostrando jovens do Vocal adorando em casa/quartos. Compilação 30s. Música: adoração conhecida. Mostrar que adoração não é só no culto.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_010", contaId: "3", titulo: "Cristo no trabalho, no estudo, em casa",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-19", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel prático - 3 áreas da vida. Como viver Cristo em cada uma. Template visual separado por área.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_011", contaId: "3", titulo: "Convite: Culto de jovens - Tema especial",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-05-22", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel de convite para culto de jovens. 20-30s. Info: data, hora, local, tema. Visual dinâmico com countdown.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_012", contaId: "3", titulo: "O coração que Deus transforma",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-26", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel sobre transformação interior. Base bíblica: Ezequiel 36:26. Design contemplativo.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_013", contaId: "3", titulo: "Galera do Vocal reunida",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-05-29", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel compilação de momentos de comunhão do mês. Mostrar unidade, amizade, risadas, oração juntos. 40s.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_014", contaId: "3", titulo: "Rendição total: o que significa?",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-02", horarioplanejado: "18:00",
    legenda: "", observacoes: "INÍCIO FASE 2 - Aprofundamento. Carrossel explicando rendição verdadeira vs rendição superficial. 8 slides.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_015", contaId: "3", titulo: "Desafio: 7 dias com Cristo no centro",
    formato: "reels", pilar: "ensino",
    dataplanejada: "2026-06-05", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel lançando desafio prático de 7 dias. Criar card visual com os 7 dias. Engajamento: comentar 'aceito' + stories diários.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_016", contaId: "3", titulo: "Como orar quando Deus parece distante",
    formato: "carrossel", pilar: "outro",
    dataplanejada: "2026-06-09", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel pastoral - tema sensível. Tom: acolhedor mas bíblico. Salmo 13, Salmo 42.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_017", contaId: "3", titulo: "Resultado do desafio - Depoimentos",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-06-12", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel com mini-depoimentos de quem fez o desafio dos 7 dias. 3-4 jovens, 10-15s cada. Total 45-60s.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_018", contaId: "3", titulo: "Relacionamentos: Cristo no centro muda tudo",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-16", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel sobre relacionamentos (amizades, namoro, família) com Cristo no centro. Prático e jovem.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_019", contaId: "3", titulo: "Louvor espontâneo - Momento real",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-06-19", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel capturando louvor espontâneo após culto ou reunião. Não ensaiado. Real. 30-40s.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_020", contaId: "3", titulo: "O que é idolatria moderna?",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-23", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel identificando ídolos sutis da geração: redes sociais, aprovação, relacionamentos, sucesso. Tom: confrontador mas amoroso.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_021", contaId: "3", titulo: "Convite: Evento especial de jovens",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-06-26", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel de convite. Design atraente. Info completa. CTA: confirmar presença nos comentários.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_022", contaId: "3", titulo: "Liberdade verdadeira em Cristo",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-30", horarioplanejado: "18:00",
    legenda: "", observacoes: "FECHAMENTO JUNHO - Carrossel sobre liberdade vs libertinagem. João 8:36, Gálatas 5:1. Design forte.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_023", contaId: "3", titulo: "Identidade em Cristo: quem você é de verdade",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-02", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel sobre identidade. Lista de 'quem sou em Cristo' com base bíblica. Design empoderador.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_024", contaId: "3", titulo: "Bastidores: Preparação de culto",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-07-06", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel mostrando preparação de culto de jovens: ensaio de louvor, oração pré-culto, setup. Humanizar o processo.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_025", contaId: "3", titulo: "Santidade não é chata",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-09", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel desconstruindo mitos sobre santidade. Tom jovem mas reverente. Mostrar que santidade = plenitude de vida.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_026", contaId: "3", titulo: "Comunhão: Por que precisamos uns dos outros",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-07-13", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel com cenas de comunhão real + texto sobre importância da igreja local e comunidade. 40s.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_027", contaId: "3", titulo: "Quebrando cadeias: Cristo liberta",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-07-16", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel evangelístico. Para quem ainda não entregou tudo a Cristo. Tom: urgente mas acolhedor.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_028", contaId: "3", titulo: "Oração em grupo - Força da união",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-07-20", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel mostrando círculo de oração dos jovens. Não precisa áudio da oração (privacidade). Música instrumental reverente.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_029", contaId: "3", titulo: "Como permanecer firme quando tudo desaba",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-23", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel pastoral sobre firmeza em tempos difíceis. Mateus 7:24-27 (casa na rocha).",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_030", contaId: "3", titulo: "Convite: Encontro de Jovens - Julho",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-07-27", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel de convite para encontro especial de julho. Design impactante.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_031", contaId: "3", titulo: "Metade do caminho - Recapitulação",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-30", horarioplanejado: "18:00",
    legenda: "", observacoes: "MARCO IMPORTANTE - Metade da jornada (abr-jul completo). Recapitula aprendizados. Renova compromisso para ago-nov.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_032", contaId: "3", titulo: "Desafio Agosto: Viver Cristo em tudo",
    formato: "reels", pilar: "ensino",
    dataplanejada: "2026-08-03", horarioplanejado: "18:00",
    legenda: "", observacoes: "INÍCIO FASE 3 - Aplicação. Reel lançando desafio do mês inteiro. Card com checklist semanal. Engajamento alto esperado.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_033", contaId: "3", titulo: "Semana 1: Transformando a rotina",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-06", horarioplanejado: "18:00",
    legenda: "", observacoes: "Desafio prático semana 1: Como viver Cristo na rotina. Ações concretas diárias.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_034", contaId: "3", titulo: "Check-in: Como está sendo o desafio?",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-08-10", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel com mini-entrevistas de jovens fazendo o desafio. Depoimentos rápidos. Criar senso de comunidade.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_035", contaId: "3", titulo: "Semana 2: Cristo nos relacionamentos",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-13", horarioplanejado: "18:00",
    legenda: "", observacoes: "Desafio prático semana 2: Aplicar Cristo em relacionamentos específicos. Ações concretas.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_036", contaId: "3", titulo: "Adoração que transborda",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-08-17", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel de momento de adoração intensa. Capturar emoção verdadeira. 35-45s.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_037", contaId: "3", titulo: "Semana 3: Cristo nas escolhas difíceis",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-20", horarioplanejado: "18:00",
    legenda: "", observacoes: "Desafio prático semana 3: Tomar decisões com Cristo no centro. Framework de discernimento.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_038", contaId: "3", titulo: "Evangelismo na prática",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-08-24", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel mostrando jovens evangelizando (ação social, testemunho, convite). Mostrar que é possível e natural.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_039", contaId: "3", titulo: "Semana 4: Cristo na adversidade",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-27", horarioplanejado: "18:00",
    legenda: "", observacoes: "Desafio prático semana 4: Manter Cristo no centro mesmo em momentos ruins. Resiliência espiritual.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_040", contaId: "3", titulo: "Resultado Agosto: Transformações reais",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-08-31", horarioplanejado: "18:00",
    legenda: "", observacoes: "FECHAMENTO AGOSTO - Compilação de depoimentos do desafio. Celebrar vitórias. Preparar para setembro.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_041", contaId: "3", titulo: "Firmeza: O que aprendi até aqui",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-03", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel reflexivo sobre aprendizados de abr-ago. Preparar terreno para fase de testemunho.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_042", contaId: "3", titulo: "Convite especial: Prepare-se para outubro",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-09-07", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel criando expectativa para Fase 4 (Testemunho). Anunciar que em outubro vão compartilhar histórias reais.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_043", contaId: "3", titulo: "Perseverança: Não desista agora",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-10", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel motivacional. Faltam 2 meses pro congresso. Hebreus 12:1-2. Correr com perseverança.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_044", contaId: "3", titulo: "Comunhão: Força da caminhada juntos",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-09-14", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel compilação de momentos de comunhão de abr-set. Celebrar jornada coletiva. Música emotiva.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_045", contaId: "3", titulo: "Compromisso renovado",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-17", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel chamando para renovar compromisso com a jornada. Preparar para testemunho em outubro.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_046", contaId: "3", titulo: "Louvor intenso - Ensaio aberto",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-09-21", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel de ensaio de louvor. Deixar entrar na intimidade da preparação. Mostrar dedicação.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_047", contaId: "3", titulo: "Preparação final: Outubro e Novembro",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-09-24", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel anunciando reta final. Outubro = testemunhos. Novembro = mobilização + congresso 21-22.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_048", contaId: "3", titulo: "Setembro: O que Deus fez em nós",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-09-28", horarioplanejado: "18:00",
    legenda: "", observacoes: "FECHAMENTO SETEMBRO - Reel celebrando transformações do mês. Preparar para fase de testemunho.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_049", contaId: "3", titulo: "Testemunho 1: [Nome] - Como Cristo mudou minha família",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-10-01", horarioplanejado: "18:00",
    legenda: "", observacoes: "INÍCIO FASE 4 - Testemunhos. Reel 60-90s. História real de transformação. Gravar com antecedência, editar bem.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_050", contaId: "3", titulo: "O poder de um testemunho",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-10-03", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel ensinando importância do testemunho. Apocalipse 12:11. Encorajar outros a compartilhar.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_051", contaId: "3", titulo: "Testemunho 2: [Nome] - Liberto de vícios",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-10-06", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel testemunho de libertação. Sensível mas poderoso. Pode alcançar muita gente não-crente.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_052", contaId: "3", titulo: "Convite: Culto de Testemunhos - Especial Outubro",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-10-08", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel convite para culto especial de testemunhos. Encorajar presença de não-crentes.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_053", contaId: "3", titulo: "Testemunho 3: [Nome] - Deus restaurou meu namoro",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-10-10", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel testemunho sobre relacionamento. Tema relevante para jovens. Tom: real, vulnerável.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_054", contaId: "3", titulo: "Sua história importa",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-10-13", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel encorajando pessoas a compartilhar testemunho. Preparar para novembro (congresso).",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_055", contaId: "3", titulo: "Testemunho 4: [Nome] - Chamado ao ministério",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-10-15", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel testemunho sobre chamado. Inspirar outros a buscar propósito em Cristo.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_056", contaId: "3", titulo: "Compilação: Deus fez de tudo em nós",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-10-17", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel compilação de todos os testemunhos de outubro. Mini-trechos. Música impactante. 60s.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_057", contaId: "3", titulo: "Testemunho 5: [Nome] - Cura emocional",
    formato: "reels", pilar: "ensino",
    dataplanejada: "2026-10-20", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel testemunho sobre cura de feridas emocionais. Tema delicado, editar com cuidado.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_058", contaId: "3", titulo: "1 MÊS PRO CONGRESSO - Contagem regressiva",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-10-22", horarioplanejado: "18:00",
    legenda: "", observacoes: "MARCO - Falta 1 mês pro congresso. Carrossel anunciando. Criar expectativa máxima. Design impactante.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_059", contaId: "3", titulo: "Testemunho 6: [Nome] - De ateu a servo",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-10-24", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel testemunho de conversão radical. Alcance evangelístico alto. Compartilhável.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_060", contaId: "3", titulo: "Novembro: O que está por vir",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-10-27", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel anunciando programação de novembro. Criar hype. Preparar para mobilização final.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_061", contaId: "3", titulo: "Outubro: Mês de testemunhos - Recapitulação",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-10-30", horarioplanejado: "18:00",
    legenda: "", observacoes: "FECHAMENTO OUTUBRO - Reel recapitulando todos testemunhos. Celebrar. Preparar para novembro.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_062", contaId: "3", titulo: "NOVEMBRO CHEGOU - A jornada culmina aqui",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-11-02", horarioplanejado: "18:00",
    legenda: "", observacoes: "INÍCIO FASE 5 - Mobilização. Reel impactante anunciando novembro. Design premium. Música épica.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_063", contaId: "3", titulo: "Congresso: Tudo que você precisa saber",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-11-04", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel com INFO COMPLETA: datas (21-22 nov), local, horários, programação, inscrição, etc.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_064", contaId: "3", titulo: "Contagem regressiva: 20 dias",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-11-06", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel com timer de contagem regressiva. Visual dinâmico. CTA: garantir inscrição.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_065", contaId: "3", titulo: "Expectativa: O que esperar do congresso",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-11-08", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel criando expectativa. Temas, preletores, louvor, momentos especiais. Sem spoiler total.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_066", contaId: "3", titulo: "Convite pessoal: Vem com a gente",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-11-10", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel com vários jovens do Vocal convidando. 5-8 jovens, 5s cada. 'Te esperamos lá!'",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_067", contaId: "3", titulo: "Adoração intensa: Preparando o coração",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-11-12", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel de adoração preparando espiritualmente para o congresso. Momento de intimidade.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_068", contaId: "3", titulo: "Últimas vagas: Garanta sua inscrição",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-11-14", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel urgente. Se houver limite de vagas, criar urgência real. Se não, criar senso de movimento.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_069", contaId: "3", titulo: "1 SEMANA - Contagem final",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-11-16", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel com energia máxima. Falta 1 semana. Design impactante. Música crescente.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_070", contaId: "3", titulo: "Preparação final: O que levar, como chegar",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-11-18", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel prático: info de transporte, o que levar, dicas, mapa, contatos. Facilitar participação.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_071", contaId: "3", titulo: "É AMANHÃ - Último chamado",
    formato: "reels", pilar: "evangelização",
    dataplanejada: "2026-11-20", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel na véspera. Último chamado. Emoção alta. 'Nos vemos amanhã!'",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_072", contaId: "3", titulo: "DIA 1 - O congresso começou!",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-11-21", horarioplanejado: "20:00",
    legenda: "", observacoes: "CONGRESSO DIA 1 - Reel com highlights do primeiro dia. Postar à noite. Captar MUITO material durante o dia.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_073", contaId: "3", titulo: "DIA 2 - Até que Ele seja tudo em nós",
    formato: "reels", pilar: "outro",
    dataplanejada: "2026-11-22", horarioplanejado: "20:00",
    legenda: "", observacoes: "CONGRESSO DIA 2 - Reel fechamento do congresso. Momentos mais impactantes. Emoção máxima.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_074", contaId: "3", titulo: "Resumo completo: Congresso 2026",
    formato: "reels", pilar: "comunhão",
    dataplanejada: "2026-11-24", horarioplanejado: "18:00",
    legenda: "", observacoes: "Reel resumo geral dos 2 dias. Compilação épica. 90-120s. Música impactante. Melhor material.",
    responsavel: "Equipe Mídia", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_075", contaId: "3", titulo: "Gratidão: Obrigado por estar conosco",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-11-26", horarioplanejado: "18:00",
    legenda: "", observacoes: "Carrossel de gratidão. Agradecer presença, engajamento, caminhada de 8 meses. Tom: sincero, emotivo.",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "vr_076", contaId: "3", titulo: "E agora? A jornada continua",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-11-28", horarioplanejado: "18:00",
    legenda: "", observacoes: "FECHAMENTO - Carrossel sobre continuidade. Congresso acabou mas jornada de viver Cristo como tudo continua. Próximos passos.",
    responsavel: "Daniel + Esposa", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_001", contaId: "1", titulo: "Reflexão de Semana Santa — O significado da cruz",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-04-01", horarioplanejado: "09:00",
    legenda: "", observacoes: "Semana Santa — tom reverente, profundo, acessível",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_002", contaId: "1", titulo: "Convite para culto de Páscoa — Domingo 05/04",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-04-03", horarioplanejado: "09:00",
    legenda: "", observacoes: "Sexta-feira Santa — tom de ponte, acolhedor",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_003", contaId: "1", titulo: "Registro do culto de Páscoa",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-04-06", horarioplanejado: "09:00",
    legenda: "", observacoes: "Atenção com fotos de menores — só com autorização",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_004", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 1: Deus não te esqueceu",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-04-08", horarioplanejado: "09:00",
    legenda: "", observacoes: "Início da série — franquia editorial recorrente",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_005", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-04-10", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template de programação — Dom/Ter/Qui",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_006", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 2: Oração transforma quem ora",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-04-13", horarioplanejado: "09:00",
    legenda: "", observacoes: "Conecta com Círculo de Oração (quinta)",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_007", contaId: "1", titulo: "Convite UMADIS — Quinta 16/04",
    formato: "feed", pilar: "vida da igreja",
    dataplanejada: "2026-04-15", horarioplanejado: "09:00",
    legenda: "", observacoes: "Identidade visual DA SUBSEDE (não usar material da UMADIS)",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_008", contaId: "1", titulo: "Registro de comunhão — UMADIS ou outro momento",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-04-17", horarioplanejado: "09:00",
    legenda: "", observacoes: "Priorizar fotos da UMADIS se disponível",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_009", contaId: "1", titulo: "Pré-Simpósio de Missões — O que é e por que participar",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-04-20", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom de convite evangelístico, não só informação",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_010", contaId: "1", titulo: "Reflexão sobre missões — Missões não é ir longe",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-04-22", horarioplanejado: "09:00",
    legenda: "", observacoes: "Aquece para o Simpósio — dois objetivos em uma peça",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_011", contaId: "1", titulo: "Abertura do Simpósio de Missões — HOJE",
    formato: "reels", pilar: "vida da igreja",
    dataplanejada: "2026-04-24", horarioplanejado: "09:00",
    legenda: "", observacoes: "Último convite — tom de expectativa",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_012", contaId: "1", titulo: "Registro do Simpósio de Missões",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-04-27", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom de gratidão — atenção com fotos de menores",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_013", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 3: Comunhão não é opcional",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-04-29", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fecha o mês reforçando integração intencional",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_014", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 4: O propósito de Deus na espera",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-04", horarioplanejado: "09:00",
    legenda: "", observacoes: "Série continua — estrutura fixa",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_015", contaId: "1", titulo: "Vida da igreja — Momentos de comunhão",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-05-06", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de EBD, café da comunhão, confraternização",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_016", contaId: "1", titulo: "Reflexão: O que significa honrar mãe e pai hoje?",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-08", horarioplanejado: "09:00",
    legenda: "", observacoes: "Pré-Dia das Mães (11/05) — tom maduro, não sentimental",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_017", contaId: "1", titulo: "Dia das Mães — Homenagem e gratidão",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-05-11", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom de gratidão institucional — evitar clichês",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_018", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 5: Perdão liberta quem perdoa",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-13", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema sensível — tom pastoral, não condenatório",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_019", contaId: "1", titulo: "Convite: Capacitação de Professores EBD (15-16/05)",
    formato: "feed", pilar: "vida da igreja",
    dataplanejada: "2026-05-15", horarioplanejado: "09:00",
    legenda: "", observacoes: "Evento regional — usar arte oficial se disponível",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_020", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-05-18", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo — reutilizável",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_021", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 6: Santidade não é perfeição",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-20", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema profundo — quebra legalismo sem relativizar",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_022", contaId: "1", titulo: "Testemunhos da Subsede — Vidas transformadas",
    formato: "carrossel", pilar: "evangelização",
    dataplanejada: "2026-05-22", horarioplanejado: "09:00",
    legenda: "", observacoes: "Só com autorização prévia — testemunhos autênticos",
    responsavel: "Daniel + Membros envolvidos", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_023", contaId: "1", titulo: "Registro de culto — Momento marcante da semana",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-05-25", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de louvor, oração, comunhão",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_024", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 7: Gratidão muda perspectiva",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-05-27", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema leve mas profundo — aplicação prática",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_025", contaId: "1", titulo: "Convite evangelístico — Você é bem-vindo como está",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-05-29", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom de ponte — acolhimento sem pressão",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_026", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 8: Fé não é sentimento",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-01", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema pastoral — diferencia fé de emoção",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_027", contaId: "1", titulo: "Vida da igreja — Ministérios da Subsede",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-06-03", horarioplanejado: "09:00",
    legenda: "", observacoes: "Louvor, EBD, projeção, mídia — oportunidades de servir",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_028", contaId: "1", titulo: "Reflexão: Paternidade responsável — Efésios 6:4",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-05", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom maduro, bíblico — não sentimental",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_029", contaId: "1", titulo: "Dia dos Pais — Honra e gratidão",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-06-08", horarioplanejado: "09:00",
    legenda: "", observacoes: "Institucional — evitar clichês",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_030", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 9: A Palavra é fundamento",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-10", horarioplanejado: "09:00",
    legenda: "", observacoes: "Reforça centralidade da Palavra — diferencial da Subsede",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_031", contaId: "1", titulo: "Convite: Festa Junina Solidária",
    formato: "feed", pilar: "vida da igreja",
    dataplanejada: "2026-06-12", horarioplanejado: "09:00",
    legenda: "", observacoes: "SE houver evento — confirmar com pastor antes",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_032", contaId: "1", titulo: "Registro de comunhão — Café da semana ou culto",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-06-15", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos espontâneas de comunhão real",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_033", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 10: Obediência é amor",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-17", horarioplanejado: "09:00",
    legenda: "", observacoes: "João 14:15 — obediência como resposta ao amor",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_034", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-06-19", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_035", contaId: "1", titulo: "Reflexão: O valor do descanso — Marcos 6:31",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-22", horarioplanejado: "09:00",
    legenda: "", observacoes: "Contra cultura do ativismo — descanso como disciplina",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_036", contaId: "1", titulo: "Vida da igreja — Bastidores da projeção/louvor",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-06-24", horarioplanejado: "09:00",
    legenda: "", observacoes: "Valoriza voluntários — humaniza ministérios",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_037", contaId: "1", titulo: "Convite evangelístico — Traga um amigo no domingo",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-06-26", horarioplanejado: "09:00",
    legenda: "", observacoes: "CTA direto — 'Marque quem você vai trazer'",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_038", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 11: A Palavra é espada",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-06-29", horarioplanejado: "09:00",
    legenda: "", observacoes: "Incentiva leitura bíblica pessoal — não dependência do pastor",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_039", contaId: "1", titulo: "Registro de culto — Meio do ano",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-07-01", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom de gratidão — fotos marcantes de jan-jun",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_040", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 12: Fé se prova na crise",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-03", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema forte — pastoral, não pessimista",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_041", contaId: "1", titulo: "Convite: Culto de Ação de Graças — Meio do ano",
    formato: "feed", pilar: "vida da igreja",
    dataplanejada: "2026-07-06", horarioplanejado: "09:00",
    legenda: "", observacoes: "SE houver culto especial — confirmar com pastor",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_042", contaId: "1", titulo: "Reflexão: Inverno espiritual — Deus não mudou",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-08", horarioplanejado: "09:00",
    legenda: "", observacoes: "Metáfora do inverno — Deus age no silêncio",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_043", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-07-10", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_044", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 13: Evangelizar é testemunhar",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-13", horarioplanejado: "09:00",
    legenda: "", observacoes: "Evangelismo como estilo de vida, não evento",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_045", contaId: "1", titulo: "Vida da igreja — EBD: O valor de estudar a Palavra",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-07-15", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos da EBD + benefícios de estudar em comunhão",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_046", contaId: "1", titulo: "Registro de comunhão — Momentos de integração",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-07-17", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de café, confraternização, conversas",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_047", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 14: Discipulado é compromisso",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-20", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema denso — Lucas 14:27-33, tom honesto não legalista",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_048", contaId: "1", titulo: "Convite evangelístico — Você não precisa estar pronto",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-07-22", horarioplanejado: "09:00",
    legenda: "", observacoes: "Quebra barreira — tom de acolhimento",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_049", contaId: "1", titulo: "Reflexão: Simplicidade na fé — Não complique o que é simples",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-24", horarioplanejado: "09:00",
    legenda: "", observacoes: "Contra religiosidade — volta ao essencial",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_050", contaId: "1", titulo: "Vida da igreja — Testemunho de membro",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-07-27", horarioplanejado: "09:00",
    legenda: "", observacoes: "Só com autorização — testemunho autêntico",
    responsavel: "Daniel + Membro", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_051", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 15: Humildade é força",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-07-29", horarioplanejado: "09:00",
    legenda: "", observacoes: "Filipenses 2:3-8 — Cristo como modelo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_052", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-07-31", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_053", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 16: Amor sem ação é vazio",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-03", horarioplanejado: "09:00",
    legenda: "", observacoes: "Equilíbrio: não salvação por obras, mas fruto visível",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_054", contaId: "1", titulo: "Vida da igreja — Registro de louvor",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-08-05", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de momentos de louvor — mãos levantadas, banda",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_055", contaId: "1", titulo: "Reflexão: O jejum que Deus aceita — Isaías 58",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-07", horarioplanejado: "09:00",
    legenda: "", observacoes: "Jejum bíblico vs jejum religioso",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_056", contaId: "1", titulo: "Convite: Culto de Celebração — Dia dos Pais (ajustado)",
    formato: "feed", pilar: "vida da igreja",
    dataplanejada: "2026-08-10", horarioplanejado: "09:00",
    legenda: "", observacoes: "SE houver culto especial — confirmar",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_057", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 17: Confiança vem de quem Deus é",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-12", horarioplanejado: "09:00",
    legenda: "", observacoes: "Confiança baseada em natureza de Deus, não circunstâncias",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_058", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-08-14", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_059", contaId: "1", titulo: "Registro de comunhão — Café ou confraternização",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-08-17", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos espontâneas — conversas, sorrisos, café",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_060", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 18: Esperar não é desperdiçar",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-19", horarioplanejado: "09:00",
    legenda: "", observacoes: "Espera como preparação, não punição",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_061", contaId: "1", titulo: "Convite evangelístico — Deus não desistiu de você",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-08-21", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom de esperança — alcança afastados",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_062", contaId: "1", titulo: "Vida da igreja — Bastidores da preparação do culto",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-08-24", horarioplanejado: "09:00",
    legenda: "", observacoes: "Valoriza voluntários — ensaio, preparação, oração",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_063", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 19: Perdão não exige esquecimento",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-26", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema sensível — perdão sem negar a dor",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_064", contaId: "1", titulo: "Reflexão: Fidelidade nas pequenas coisas — Lucas 16:10",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-08-28", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fidelidade no cotidiano, não só grandes momentos",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_065", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-08-31", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_066", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 20: A cruz é suficiente",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-02", horarioplanejado: "09:00",
    legenda: "", observacoes: "Contra auto-justificação — graça é suficiente",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_067", contaId: "1", titulo: "Convite: Campanha Nacional da Pátria (se houver)",
    formato: "feed", pilar: "vida da igreja",
    dataplanejada: "2026-09-04", horarioplanejado: "09:00",
    legenda: "", observacoes: "SE houver evento regional — confirmar antes",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_068", contaId: "1", titulo: "Registro de culto — Independência (se houver culto especial)",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-09-07", horarioplanejado: "09:00",
    legenda: "", observacoes: "Institucional — fotos do culto",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_069", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 21: Generosidade é confiança",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-09", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema financeiro — cuidado pra não soar manipulador",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_070", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-09-11", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_071", contaId: "1", titulo: "Registro de comunhão — Momentos da EBD",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-09-14", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de classes, interação, estudo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_072", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 22: Arrependimento é recomeço",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-16", horarioplanejado: "09:00",
    legenda: "", observacoes: "Arrependimento genuíno vs culpa religiosa",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_073", contaId: "1", titulo: "Convite evangelístico — É possível recomeçar",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-09-18", horarioplanejado: "09:00",
    legenda: "", observacoes: "Conecta com post anterior — esperança de recomeço",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_074", contaId: "1", titulo: "Vida da igreja — Testemunho de transformação",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-09-21", horarioplanejado: "09:00",
    legenda: "", observacoes: "Só com autorização — testemunho autêntico",
    responsavel: "Daniel + Membro", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_075", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 23: Servir é adorar",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-23", horarioplanejado: "09:00",
    legenda: "", observacoes: "Romanos 12:1 — culto racional",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_076", contaId: "1", titulo: "Reflexão: Primavera espiritual — Renovo de Deus",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-09-25", horarioplanejado: "09:00",
    legenda: "", observacoes: "Metáfora da primavera — renovação espiritual",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_077", contaId: "1", titulo: "Registro de culto — Momento marcante da semana",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-09-28", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de louvor, pregação, oração",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_078", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-09-30", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_079", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 24: O Espírito Santo guia",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-10-02", horarioplanejado: "09:00",
    legenda: "", observacoes: "Espírito Santo como guia pessoal — João 16:13",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_080", contaId: "1", titulo: "Convite: Culto de Missões (se houver)",
    formato: "feed", pilar: "vida da igreja",
    dataplanejada: "2026-10-05", horarioplanejado: "09:00",
    legenda: "", observacoes: "SE houver evento — confirmar antes",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_081", contaId: "1", titulo: "Reflexão: Crianças são herança — Salmos 127:3",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-10-07", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom maduro — responsabilidade de criar na fé",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_082", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-10-09", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_083", contaId: "1", titulo: "Dia das Crianças — Celebração",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-10-12", horarioplanejado: "09:00",
    legenda: "", observacoes: "ATENÇÃO: fotos de menores só com autorização parental",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_084", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 25: Provisão de Deus é real",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-10-14", horarioplanejado: "09:00",
    legenda: "", observacoes: "Filipenses 4:19 — provisão de Deus, não abundância automática",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_085", contaId: "1", titulo: "Registro de comunhão — Café ou momento de integração",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-10-16", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos espontâneas de integração",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_086", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 26: Testemunho é vida vivida",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-10-19", horarioplanejado: "09:00",
    legenda: "", observacoes: "Mateus 5:16 — vida como testemunho",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_087", contaId: "1", titulo: "Vida da igreja — Ministério de louvor",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-10-21", horarioplanejado: "09:00",
    legenda: "", observacoes: "Valoriza voluntários — ensaio, preparação, dedicação",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_088", contaId: "1", titulo: "Convite evangelístico — Você é esperado",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-10-23", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom acolhedor — 'Deus te espera aqui'",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_089", contaId: "1", titulo: "Reflexão: Perseverança na fé — Hebreus 12:1",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-10-26", horarioplanejado: "09:00",
    legenda: "", observacoes: "Perseverança como disciplina espiritual",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_090", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-10-28", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_091", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 27: A esperança não decepciona",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-10-30", horarioplanejado: "09:00",
    legenda: "", observacoes: "Romanos 5:5 — esperança fundada em Cristo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_092", contaId: "1", titulo: "Reflexão: Morte não é fim — 1 Coríntios 15",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-11-02", horarioplanejado: "09:00",
    legenda: "", observacoes: "Pós-finados — esperança cristã vs luto sem esperança",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_093", contaId: "1", titulo: "Registro de culto — Momento de louvor",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-11-04", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de momentos de adoração — mãos levantadas, congregação",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_094", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-11-06", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_095", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 28: Gratidão é escolha",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-11-09", horarioplanejado: "09:00",
    legenda: "", observacoes: "Gratidão como disciplina, não sentimento",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_096", contaId: "1", titulo: "Vida da igreja — Voluntários da Subsede",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-11-11", horarioplanejado: "09:00",
    legenda: "", observacoes: "Valoriza todos os ministérios — projeção, mídia, limpeza, café",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_097", contaId: "1", titulo: "Convite evangelístico — A igreja te espera",
    formato: "feed", pilar: "evangelização",
    dataplanejada: "2026-11-13", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tom de acolhimento — 'Você faz falta aqui'",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_098", contaId: "1", titulo: "Reflexão: Proclamação da República — Cidadania cristã",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-11-16", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema político — cuidado com tom, focar em princípios bíblicos",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_099", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 29: Justiça de Deus é perfeita",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-11-18", horarioplanejado: "09:00",
    legenda: "", observacoes: "Salmos 37 — confiança na justiça divina",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_100", contaId: "1", titulo: "Reflexão: Consciência Negra — Unidade em Cristo",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-11-20", horarioplanejado: "09:00",
    legenda: "", observacoes: "Tema sensível — focar em unidade cristã, dignidade humana",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_101", contaId: "1", titulo: "Registro de comunhão — Momentos da semana",
    formato: "carrossel", pilar: "comunhão",
    dataplanejada: "2026-11-23", horarioplanejado: "09:00",
    legenda: "", observacoes: "Fotos de integração, café, conversas",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_102", contaId: "1", titulo: "Programação semanal da Subsede",
    formato: "feed", pilar: "comunhão",
    dataplanejada: "2026-11-25", horarioplanejado: "09:00",
    legenda: "", observacoes: "Template fixo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_103", contaId: "1", titulo: "Verdades que sustentam a fé — Ep. 30: Preparação para o Natal",
    formato: "carrossel", pilar: "ensino",
    dataplanejada: "2026-11-27", horarioplanejado: "09:00",
    legenda: "", observacoes: "Pré-Natal — preparação espiritual, não consumismo",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "ss_104", contaId: "1", titulo: "Convite: Cantata de Natal ou Culto Especial",
    formato: "carrossel", pilar: "vida da igreja",
    dataplanejada: "2026-11-30", horarioplanejado: "09:00",
    legenda: "", observacoes: "Confirmar evento com pastor — pode ser regional",
    responsavel: "Daniel + Pastor", status: "rascunho", linkArquivo: ""
  },
  {
    id: "px_001", contaId: "2", titulo: "3 detalhes sutis que destroem percepção",
    formato: "carrossel", pilar: "diagnóstico",
    dataplanejada: "2026-04-10", horarioplanejado: "08:00",
    legenda: "", observacoes: "",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "px_003", contaId: "2", titulo: "IA: quando funciona vs quando falha",
    formato: "reels", pilar: "diagnóstico",
    dataplanejada: "2026-04-15", horarioplanejado: "08:00",
    legenda: "", observacoes: "",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "px_005", contaId: "2", titulo: "6 decisões ANTES de abrir a IA",
    formato: "carrossel", pilar: "bastidor",
    dataplanejada: "2026-04-18", horarioplanejado: "08:00",
    legenda: "", observacoes: "",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "px_007", contaId: "2", titulo: "Por que grid perfeito não gera cliente",
    formato: "reels", pilar: "diagnóstico",
    dataplanejada: "2026-04-22", horarioplanejado: "08:00",
    legenda: "", observacoes: "",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "px_009", contaId: "2", titulo: "O que sua bio comunica sobre seu ticket",
    formato: "carrossel", pilar: "oferta",
    dataplanejada: "2026-04-25", horarioplanejado: "08:00",
    legenda: "", observacoes: "",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
  {
    id: "px_011", contaId: "2", titulo: "Refazer vs ajustar: quando cada um?",
    formato: "carrossel", pilar: "oferta",
    dataplanejada: "2026-04-29", horarioplanejado: "08:00",
    legenda: "", observacoes: "",
    responsavel: "Daniel", status: "rascunho", linkArquivo: ""
  },
],

  tarefas: [
    { id: 't1', titulo: 'Reunião com as Irmãs — briefing + definir responsável', dominio: 'REUNIÃO', concluida: false },
    { id: 't2', titulo: 'Confirmar Emanuelly — função e disponibilidade', dominio: 'EQUIPE', concluida: false },
    { id: 't3', titulo: 'Confirmar Rayssa Vitória — Canva e escala', dominio: 'EQUIPE', concluida: false },
    { id: 't4', titulo: 'Produzir conteúdo Subsede (sábado)', dominio: 'CONTEÚDO', concluida: false },
    { id: 't5', titulo: 'Produzir conteúdo Plixel (sábado)', dominio: 'CONTEÚDO', concluida: false },
    { id: 't6', titulo: 'Avançar templates Canva da Subsede', dominio: 'CONTEÚDO', concluida: false },
    { id: 't7', titulo: 'Alinhar músicas com responsável do louvor', dominio: 'CULTO', concluida: false },
    { id: 't8', titulo: 'Definir quem grava o culto de domingo', dominio: 'CULTO', concluida: false }
  ],

  equipe: [
    { id: 'e1', nome: 'Daniel Pires', iniciais: 'DP', funcao: 'Coordenação geral · Projeção domingo · Design · Photoshop · Canva · Holyrics', status: 'ativo' },
    { id: 'e2', nome: 'Janete Felix', iniciais: 'JF', funcao: 'Projeção terça e quinta', status: 'ativo' },
    { id: 'e3', nome: 'Francis Pinheiro', iniciais: 'FP', funcao: 'Projeção eventual · Reserva geral · Não sobrecarregar', status: 'eventual' },
    { id: 'e4', nome: 'Luiz André', iniciais: 'LA', funcao: 'Design remoto · Photoshop · Precisa de templates prontos', status: 'parcial' },
    { id: 'e5', nome: 'Aline Pinheiro', iniciais: 'AP', funcao: 'Fotografia · Disponibilidade parcial', status: 'parcial' },
    { id: 'e6', nome: 'Emanuelly Oliveira', iniciais: 'EO', funcao: 'Vídeo vertical + edição · Função a definir', status: 'ativo' },
    { id: 'e7', nome: 'Rayssa Vitória', iniciais: 'RV', funcao: 'Design Canva · Melhor com templates prontos', status: 'confirmar' },
    { id: 'e8', nome: 'Maysa Hellen', iniciais: 'MH', funcao: 'Design remoto · Photoshop · Grávida — trabalho limitado', status: 'limitado' },
    { id: 'e9', nome: 'Samara Alves', iniciais: 'SA', funcao: 'Vídeo vertical · Stories ao vivo · Retorno indefinido', status: 'limitado' }
  ],

  lacunas: [
    { id: 'l1', funcao: 'Gestor de Redes', descricao: 'Tudo com Daniel hoje', atual: 0, necessario: 2 },
    { id: 'l2', funcao: 'Cinegrafista Vertical', descricao: 'Domingo sem cobertura fixa', atual: 0, necessario: 2 },
    { id: 'l3', funcao: 'Operador de Projeção', descricao: 'Fácil de treinar — prioridade', atual: 2, necessario: 5 },
    { id: 'l4', funcao: 'Responsável por Stories', descricao: 'Ninguém publica ao vivo', atual: 0, necessario: 2 },
    { id: 'l5', funcao: 'Responsáveis de Conjunto', descricao: 'Irmãs · Jovens · Crianças · Adolescentes · Coral', atual: 0, necessario: 5 }
  ],

  eventos: [
    { id: 'ev1', nome: 'Reunião com as Irmãs', conjunto: 'Conjunto das Irmãs', dia: null, mes: 4, ano: 2026 },
    { id: 'ev2', nome: 'EBF', conjunto: 'Crianças', dia: null, mes: null, ano: 2026 },
    { id: 'ev3', nome: 'Congresso das Irmãs', conjunto: 'Conjunto das Irmãs', dia: null, mes: null, ano: 2026 },
    { id: 'ev4', nome: 'Congresso dos Adolescentes', conjunto: 'Adolescentes', dia: null, mes: null, ano: 2026 },
    { id: 'ev5', nome: 'Congresso dos Jovens', conjunto: 'Vocal Renascer', dia: null, mes: 11, ano: 2026 }
  ]

};
