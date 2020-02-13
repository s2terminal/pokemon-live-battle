import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'

/** 対戦1回をあらわす */
class Battle {
  readonly fighterA: string | undefined;
  readonly fighterB: string | undefined;
  readonly roomNumber: number;

  constructor(fighterA: string | undefined, fighterB: string | undefined, roomNumber: number) {
    this.fighterA = fighterA;
    this.fighterB = fighterB;
    this.roomNumber = roomNumber;
  }

  public describe(): string {
    const room = this.battleGroupNumber();
    return `${this.fighterA}(対戦グループ番号: ${room}1) vs ${this.fighterB}(対戦グループ番号: ${room}2)`;
  }

  public describeView(viewerNumber: number) {
    const f = new Intl.NumberFormat('ja', { minimumIntegerDigits: 1 }).format;
    return `観戦番号: ${this.battleGroupNumber()}${f(viewerNumber)}`;
  }

  public battleGroupNumber(): string {
    const f = new Intl.NumberFormat('ja', { minimumIntegerDigits: 2 }).format;
    return f(this.roomNumber);
  }
}

/** 総当たり */
function soatari(members: string[]): Battle[][] {
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

// メインコンポーネント
const Home = () => {
  const title = 'ライブ大会の対戦ルーム番号';

  const [membersString, setMembersString] = React.useState("タケシ, カスミ, マチス, エリカ");
  const handleChange = (event) => {
    setMembersString(event.target.value);
  }
  const battlesArray = soatari(membersString.split(","));

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="hero">
        <h1 className="title">{title}</h1>
        <p className="description">
          対戦する人の名前をカンマ切りで入れてね
        </p>
        <input type="text" name="name" size={64} value={membersString} onChange={handleChange} />

        <h2>総当たり対戦</h2>
        {battlesArray.map((battles: Battle[], battleRound) => {
          return (
            <div key={battleRound}>
              <h3>第{battleRound+1}回戦</h3>
              {battles.map(battle => {
                return <div key={battle.roomNumber}>{battle.describe()} {battle.describeView(3)}</div>;
              })}
            </div>);
        })}

        <h2>ライブ大会のやりかた</h2>
        <p className="description">
          <a href="https://www.pokemon.co.jp/ex/sword_shield/howtoplay/191108_vs.html">
            『ポケモン ソード・シールド』で、バトル大会を楽しむ方法｜『ポケットモンスター ソード・シールド』公式サイト
          </a>を読もう
        </p>

      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          line-height: 1.15;
          font-size: 48px;
        }
      `}</style>
    </div>
  )
};

export default Home
