import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Header from '../sections/Header';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Synthetix Wrappr</title>
        <meta name="description" content="Simple user interface that allows to interact with the various Synthetix Wrappr contracts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header />
      </main>
    </div>
  )
}

export default HomePage;
