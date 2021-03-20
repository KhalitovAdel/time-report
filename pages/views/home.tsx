import * as React from 'react';
import { NextPage, NextPageContext } from 'next';
import cfg from 'next/config';

interface Props {
  query: { name?: string };
}

const Home: NextPage<Props> = ({ query }) => {
  const greetName = query.name ? query.name : process.env.NEXT_PUBLIC_API_URL;
  return (
    <div>
      <div>
        Hello, {greetName}! {process.env.NEXT_PUBLIC_API_URL}
      </div>
    </div>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const query = {
    name: ctx.query.name || null,
  };
  return { props: { query } };
}

export default Home;
