enum Rank {
  YOKOZUNA = 'Y',
  OZEKI = 'O',
  SEKIWAKE = 'S',
  KOMUSUBI = 'K',
  MAEGASHIRA = 'M',
  JURYO = 'J',
  MAKUSHITA = 'Ms'
}

export const DIV_MAKUUCHI = [Rank.YOKOZUNA, Rank.OZEKI, Rank.SEKIWAKE, Rank.KOMUSUBI, Rank.MAEGASHIRA];
export const DIV_JURYO = [Rank.JURYO];
export const DIV_MAKUSHITA = [Rank.MAKUSHITA];

export default Rank;
