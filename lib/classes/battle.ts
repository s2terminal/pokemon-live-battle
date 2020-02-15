/** 対戦1回をあらわす */
export default class Battle {
  readonly fighter1: string | undefined;
  readonly fighter2: string | undefined;
  readonly roomNumber: number;

  static readonly Fighter = { 1: "fighter1", 2: "fighter2" } as const;

  private constructor(fighter1: string | undefined, fighter2: string | undefined, roomNumber: number) {
    this.fighter1 = fighter1;
    this.fighter2 = fighter2;
    this.roomNumber = roomNumber;
  }

  public battleGroupNumber(playerId: number): string {
    const roomFormat = new Intl.NumberFormat('ja', { minimumIntegerDigits: 2 }).format;
    const playerFormat = new Intl.NumberFormat('ja', { minimumIntegerDigits: 1 }).format;
    return `${roomFormat(this.roomNumber)}${playerFormat(playerId)}`;
  }

  public static fighterIds(): (keyof typeof Battle.Fighter)[] {
    return Object.keys(Battle.Fighter).map(str => Number(str) as keyof typeof Battle.Fighter);
  }

  public getFighter(fighterId: keyof typeof Battle.Fighter) {
    return { 1: this.fighter1, 2: this.fighter2 }[fighterId];
  }

  /** 総当たり */
  public static soatari(members: string[]): Battle[][] {
    const ret = [];
    // 5人なら5回(休1回)、6人なら5回、7人なら7回(休1回)...
    for (let battleRound = 0; battleRound < Math.floor((members.length - 1) / 2) * 2 + 1; battleRound++) {
      const battles = [];
      const membersForRoop = [...members];
      let left: string | null = null;
      // 偶数人数だったら、末尾をパス
      if (members.length % 2 === 0) {
        left = membersForRoop.pop();
      }

      const dup = membersForRoop.slice(battleRound, membersForRoop.length).concat(membersForRoop.slice(0, battleRound));

      // 以降、奇数確定
      let battleNumber = 0;
      // 5人なら2回、6人なら2回、7人なら3回...
      for (; battleNumber < Math.floor((members.length - 1) / 2); battleNumber++) {
        const battle = new Battle(dup.shift(), dup.pop(), battleNumber);
        battles.push(battle);
      }

      // パスした人がいたら、残りの人と戦わせる
      if (left !== null) {
        battles.push(new Battle(left, dup.pop(), battleNumber));
      }

      ret.push(battles);
    }
    return ret;
  }
}
