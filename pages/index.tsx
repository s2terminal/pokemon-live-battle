import React from 'react'
import Head from 'next/head'
import Header from '../lib/components/header'
import Button from '@material-ui/core/Button';
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
import Paper from '@material-ui/core/Paper';

const title = 'ポケモン剣盾 ライブ大会の対戦ルーム番号を計算するやつ';

// メインコンポーネント
const Home = () => {
  const [membersString, setMembersString] = React.useState("タケシ, カスミ, マチス, エリカ");
  const handleChange = (event) => {
    setMembersString(event.target.value);
  }
  const battlesArray = Battle.soatari(membersString.split(","));

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />

      <Header title={title} />

      <Container>
        <p className="description">
          対戦する人の名前をカンマ切りで入れてね
        </p>
        <TextField value={membersString} style={{width: "100%"}} onChange={handleChange} />

        <h2>総当たり対戦</h2>

        <TableContainer>
          <Table>
              {battlesArray.map((battles: Battle[], battleRound) => {
                return (
                  <React.Fragment key={battleRound}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={3}>
                          <h3>第{battleRound+1}回戦</h3>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {battles.map(battle => {
                        return (
                        <TableRow key={battle.roomNumber}>
                          {Battle.fighterIds().map(player => {
                            return (
                              <TableCell key={player}>
                                {battle.getFighter(player)}<br/>
                                対戦ルーム番号: {battle.battleGroupNumber(player)}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            観戦者<br />
                            対戦ルーム番号: {battle.battleGroupNumber(3)}
                          </TableCell>
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
          <a href="https://www.pokemon.co.jp/ex/sword_shield/howtoplay/191108_vs.html">
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
