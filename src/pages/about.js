import Head from 'next/head';
import styles from '../styles/About.module.css';

import Link from "next/link";

export default function About() {
  return (
    <>
      <Head />

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
          Техническая информация о веб-приложении
        </h1>
        <div className={styles.description}>
          Данное приложение сделано на фреймворке <a href="https://nextjs.org/" className="external_link">Next.js</a>, основанном на библиотеке <a href="https://reactjs.org/" className="external_link">React</a>.
        </div>
      </div>
    </>
  );
}