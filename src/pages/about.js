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
          <p><a href="https://nextjs-lazytech-portfolio-20210420-2.netlify.app" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">Первоначальный вариант</a> проекта был реализован на фреймворке Next.js «из коробки», то есть как на сервере, так и на клиенте использовалась библиотека React. Однако эта библиотека достаточно «тяжелая» для столь простого веб-приложения, поэтому в данном варианте проекта на клиенте вместо нее используется ее более «легкий» аналог <a href="https://reactjs.org/" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">Preact</a> (для серверного рендеринга, как и раньше, используется React). Новый вариант особенно хорошо подходит для «слабых» клиентских устройств, поскольку клиентский браузер загружает и парсит меньше JavaScript-кода (см. два скриншота ниже).</p>
          <p>Вот как загружается старый вариант приложения, в котором везде используется React:</p>
          <div className={styles.imageContainer}>
            <img src='/assets/images/react-network.gif' 
              alt='Старая версия (React)' 
              className={styles.image}     
              loading='lazy'    
              width='726' 
              height='297'
            />
          </div>
          <p>А вот процесс загрузки нового варианта, в котором на клиенте используется Preact:</p>
          <div className={styles.imageContainer}>
            <img src='/assets/images/preact-network.gif' 
              alt='Новая версия (Preact)' 
              className={styles.image}     
              loading='lazy'
              width='728' 
              height='298'
            />
          </div>
          <p>Перевести клиентскую часть приложения с React на Preact оказалось очень просто. Сначала я установил свежую версию Preact (которая, в отличие от более ранних версий, содержит в себе модуль <a href="https://github.com/preactjs/preact-compat" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">preact-compat</a>, так что мне не понадобилось отдельно его устанавливать). Далее я внес изменения в файл next.config.js, опираясь на статьи <a href="https://dev.to/dlw/next-js-replace-react-with-preact-2i72" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">Next.js: Replace React with Preact</a> и <a href="https://vercel.com/blog/10-next-js-tips-you-might-not-know" className="external_link" style={{ wordBreak: 'normal' }} target="_blank" rel="noopener">10 Next.js Tips You Might Not Know</a>. И всё, приложение запустилось без ошибок с первой попытки!</p>
        </div>
      </div>
    </>
  );
}