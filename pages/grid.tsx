import { Orientation } from 'honeycomb-grid';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import { HexGridProvider } from '../lib/hooks/useHexGrid';

import type { NextPage } from 'next';
const HexMap = dynamic(() => import('../components/map/HexMap'), {
  ssr: false,
});

const Grid: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Maya Grid</title>
        <meta name="description" content="Grid Example for Crypto Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HexGridProvider
        dimensions={30}
        offset={0}
        orientation={Orientation.FLAT}
        origin={'topLeft'}
        viewDistance={3}
        contour={[0.2, 0.3, 0.5, 0.7, 0.9]}
      >
        <HexMap />
      </HexGridProvider>
    </div>
  );
};

export default Grid;
