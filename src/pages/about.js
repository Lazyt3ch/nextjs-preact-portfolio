import Head from 'next/head';
import styles from '../styles/About.module.css';

// import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>Техническая информация о веб-приложении</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
          Техническая информация о веб-приложении
        </h1>
        <div className={styles.description}>
          <p>Данное приложение сделано на фреймворке <a href="https://nextjs.org/" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">Next.js</a>, основанном на библиотеке <a href="https://reactjs.org/" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">React</a>. Этот фреймворк значительно упрощает задачу по генерации веб-страниц на сервере. При таком подходе клиентский браузер получает готовую страницу, которую сразу можно начать отрисовывать. (При альтернативном подходе, когда страницы генерируются на клиенте, браузер получает заготовку страницы, которую сначала надо заполнить текстовым содержимым. А для того, чтобы можно было заполнить страницу содержимым, необходимо получить и распарсить соответствующий JavaScript-код.)</p>
          <p>Текстовые данные для серверной генерации страниц приложения берутся из <a href="https://freelance.habr.com/freelancers/Lazytech" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">профиля фрилансера Lazytech</a> на сайте <a href="https://freelance.habr.com/" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">Хабр Фриланс</a>.</p>
          <p>Верстка страниц адаптивная («отзывчивая»). Изображения, показываемые на страницах, хранятся на стороннем сайте. Поскольку ширина и высота картинок в общем случае неизвестны и могут быть произвольными, пришлось принять меры по предотвращению перетекания содержимого и подергивания страницы при их загрузке и отрисовке. С этой целью сервер приложения сначала запрашивает со стороннего сайта параметры всех изображений, а затем генерирует страницу с учетом полученных размеров.</p>
          <p>Отдельные страницы (например, данная страница) создаются на сервере не при каждом запросе, а лишь однократно («статическая генерация»), что позволяет снизить нагрузку на сервер.</p>
        </div>
      </div>
    </>
  );
}