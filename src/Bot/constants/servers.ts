export const showdownServers: {
  [key: string]: ShowdownServerType;
} = {
  showdown: {
    name: 'Showdown',
    link: 'https://play.pokemonshowdown.com',
    ip: 'sim3.psim.us:8000',
    server: 'ws://sim3.psim.us:8000/showdown/websocket',
  },
  dl: {
    name: 'DL',
    link: 'https://dl.psim.us',
    ip: 'dlsim.radicalred.net:8000',
    server: 'ws://dlsim.radicalred.net:8000/showdown/websocket',
  },
  radicalred: {
    name: 'RadicalRed',
    link: 'radicalred.net',
    ip: 'sim.radicalred.net:8000',
    server: 'ws://sim.radicalred.net:8000/showdown/websocket',
  },
};

type ShowdownServerType = {
  name: string;
  link: string;
  ip: string;
  server: string;
};
