import Head from 'next/head';

import styles from '../styles/Home.module.css';

import Header from '../sections/faq/Header';
import Content from '../sections/faq/Content';

const Faq = () => {
    return(
        <>
            <Head>
                <title>Synthetix Wrappr - FAQ</title>
                <meta name="description" content="Simple user interface that allows to interact with the various Synthetix Wrappr contracts" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Header />
                <Content />
            </main>
        </>
    );
};

export default Faq;
