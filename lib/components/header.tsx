import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const links = [
  { href: 'https://github.com/s2terminal/pokemon-live-battle', label: 'GitHubでソースをみる' },
].map(link => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}));

export default function Header(props: { title: string }) {
  return (
    <nav>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            {props.title}
          </Typography>
          <ul>
            {links.map(({ key, href, label }) => (
              <li key={key}>
                <Link href={href} style={{color: "#fff"}} target="_blank">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Toolbar>
      </AppBar>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
        }
        ul {
          display: flex;
          justify-content: space-between;
        }
        nav > ul {
          padding: 4px 16px;
          text-align: right;
        }
        li {
          display: flex;
          padding: 6px 8px;
        }
        nav {
        }
        a {
          color: #ffffff;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>
    </nav>
  );
};
