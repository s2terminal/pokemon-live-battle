import React from 'react'
import Head from 'next/head'
import Header from '../lib/components/header'
import CssBaseline from '@material-ui/core/CssBaseline';
import Battle from '../lib/classes/battle';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const TITLE = 'ポケモン剣盾 ライブ大会の対戦ルーム番号を計算するやつ';
const CANONICAL_URL = 'https://s2terminal.github.io/pokemon-live-battle/';
const SAVE_QUERYSTRING_KEY = 'member';
type saveParams = {
  fightersString: string, observersString: string
};

// メインコンポーネント
const Home = () => {
  const [fightersString, setFightersString] = React.useState("タケシ, カスミ, マチス, エリカ");
  const [observersString, setObserversString] = React.useState("オーキドはかせ");
  const handleChangeFighters = (event) => { setFightersString(event.target.value); };
  const handleChangeObservers = (event) => { setObserversString(event.target.value); };

  const fighters = fightersString.split(",")
  const observers = (observersString === "") ? [] : observersString.split(",");
  const battlesArray = Battle.soatari(fighters);

  const saveURL = (saveParams: saveParams): string => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(SAVE_QUERYSTRING_KEY, JSON.stringify(saveParams));
      return url.href;
    } catch (error) {
      return '';
    }
  }

  const loadURL = (): saveParams => {
    try {
      const url = new URL(decodeURI(window.location.href));
      const data = JSON.parse(url.searchParams.get(SAVE_QUERYSTRING_KEY));
      if (!data?.fightersString && !data?.observersString) { return; };

      url.searchParams.delete(SAVE_QUERYSTRING_KEY);
      window.history.pushState(null, null, url.toString());

      return { fightersString: data?.fightersString.toString(), observersString: data?.observersString.toString() };
    } catch (error) {
      console.debug(error);
    }
  }

  const loadedParams = loadURL();
  if (loadedParams) {
    setFightersString(loadedParams.fightersString);
    setObserversString(loadedParams.observersString);
  }

  return (
    <div>
      <Head>
        <title>{TITLE}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={CANONICAL_URL} />
      </Head>
      <CssBaseline />

      <Header title={TITLE} />

      <Container>
        <h2>設定</h2>
        <p className="description">
          対戦するひとの名前をカンマ切りで入れてね
        </p>
        <TextField
          value={fightersString}
          style={{width: "100%"}}
          onChange={handleChangeFighters}
          variant="outlined"
          label={`対戦するひと(${fighters.length}人)`}
        />
        <p className="description">
          対戦せず観戦するひとの名前をカンマ切りで入れてね
        </p>
        <TextField
          value={observersString}
          style={{width: "100%"}}
          onChange={handleChangeObservers}
          variant="outlined"
          label={`観戦するひと(${observers.length}人)`}
        />

        <p className="description">
          この対戦メンバーの共有用URL
        </p>
        <TextField
          value={saveURL({fightersString, observersString})}
          style={{width: "100%"}}
          disabled
          size="small"
        />

        <h2>総当たり対戦</h2>

        <TableContainer>
          <Table size="small">
              {battlesArray.map((battles: Battle[], battleRound) => {
                return (
                  <React.Fragment key={battleRound}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={Object.values(Battle.Fighter).length + observers.length}>
                          <h3>第{battleRound+1}回戦</h3>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center" colSpan={Object.values(Battle.Fighter).length}>
                          対戦するひと
                        </TableCell>
                        <TableCell align="center" colSpan={observers.length}>
                          観戦するひと
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {battles.map(battle => {
                        return (
                        <TableRow hover key={battle.roomNumber}>
                          {Battle.fighterIds().map(player => {
                            return (
                              <TableCell align="center" key={player}>
                                {battle.getFighter(player)}<br/>
                                {battle.battleGroupNumber(player)}
                              </TableCell>
                            );
                          })}
                          {observers.map((observer, i) => {
                            return (
                              <TableCell align="center" key={i}>
                                {observer} (観戦)<br/>
                                {battle.battleGroupNumber(i + 3)}
                              </TableCell>
                            );
                          })}
                        </TableRow>);
                      })}
                      </TableBody>
                  </React.Fragment>
                  );
              })}
          </Table>
        </TableContainer>

        <h2>ライブ大会のやりかた</h2>
        <p className="description">
          <a href="https://www.pokemon.co.jp/ex/sword_shield/howtoplay/191108_vs.html" target="_blank">
            『ポケモン ソード・シールド』で、バトル大会を楽しむ方法｜『ポケットモンスター ソード・シールド』公式サイト
          </a>を読もう
        </p>

      </Container>

      <style jsx>{`
        .className {
        }
      `}</style>
    </div>
  )
};

export default Home
