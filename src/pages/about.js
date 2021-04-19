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
          <p>Данное приложение сделано на фреймворке <a href="https://nextjs.org/" className="external_link">Next.js</a>, основанном на библиотеке <a href="https://reactjs.org/" className="external_link">React</a>.</p>
          <p>Текстовые данные для серверной генерации страниц данного веб-приложения берутся («парсятся») из <a href="https://freelance.habr.com/freelancers/Lazytech" className="external_link">профиля фрилансера Lazytech</a> на сайте <a href="https://freelance.habr.com/" className="external_link">Хабр Фриланс</a>.</p>
          <p>Отдельные страницы (например, страница <Link href="/about"><a className="external_link">«О проекте»</a></Link>) создаются на сервере не при каждом запросе, а лишь однократно: используется так называемая статическая генерация страниц.</p>
          <p>Верстка страниц адаптивная («отзывчивая»).</p>
        </div>
      </div>
    </>
  );
}