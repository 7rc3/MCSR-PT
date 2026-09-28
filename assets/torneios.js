// ─────────────────────────────────────────────────────────────────────────────
// Tournaments & events shown on torneios.html
//
// To add an event, copy the template below into the TORNEIOS list and fill it in.
// To finish an event, change `status` to 'terminado' and fill in `podium`.
// Order doesn't matter: the page groups by status and sorts by date.
//
// {
//   name:        'Nome do torneio',            // required
//   edition:     '1ª Edição',                  // optional small label
//   status:      'em-breve',                   // 'a-decorrer' | 'em-breve' | 'terminado'
//   date:        '2026-11-15',                 // 'YYYY-MM-DD', or null → "Data a anunciar"
//   time:        '21:00',                      // optional, Portugal time
//   description: 'Texto curto sobre o evento.',
//   details: [                                 // optional label/value rows
//     { label: 'Formato', value: 'Eliminação simples' },
//   ],
//   links: [                                   // optional buttons; the first one is highlighted
//     { label: 'Inscrever', url: 'https://…', icon: 'pencil-square' },  // icon = Bootstrap Icons name
//   ],
//   podium: ['1º lugar', '2º lugar', '3º lugar'],  // Minecraft nicknames, for 'terminado'
//   image: 'assets/banner.png',                // optional banner
// },
// ─────────────────────────────────────────────────────────────────────────────

const TORNEIOS = [
  {
    name:        'Tugão',
    edition:     '1ª Edição',
    status:      'a-decorrer',
    date:        null,
    description: 'Playoffs Português',
    details: [
      { label: 'Formato', value: 'Playoffs' },
      // { label: 'Região',  value: 'Portugal' },
    ],
    links: [
      { label: 'Bracket', url: 'https://challonge.com/pt/s0ftaal6' },
      { label: 'Mais info no Discord', url: 'https://discord.gg/C6WZs4Eq3n', icon: 'discord' },
    ],
  },
];
