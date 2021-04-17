import Head from 'next/head'
import styles from '../styles/Home.module.css'
const { JSDOM } = require('jsdom');

const baseUrlSlash = "https://freelance.habr.com/";

export default function Home({ items }) {
  return (
    <>
      <Head />
      <h1 className="align-center">Образцы работ фрилансера Lazytech</h1>
      <div className={styles.container}>
        { items.map((item) =>
          <div key={item.id}>
            <a href={item.href} target="_blank">
              <div>{item.title}</div>
              <img src={item.previewImgSrc} alt={item.title} />
            </a>
          </div>
        ) }
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${baseUrlSlash}freelancers/Lazytech/projects`, 
      { 
        method: "GET",
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );

    const text = await res.text();

    const fragmentStart = text.indexOf("<dl ");
    const fragmentEnd = text.indexOf("</dl>", fragmentStart + 4);
    const fragment = text.slice(fragmentStart, fragmentEnd + 5);

    const dom = new JSDOM(fragment);
    const document = dom.window.document;

    const projectNodes = document.querySelectorAll(".project_item");
    const projectItems = Array.from(projectNodes).map((item, idx) => ({
        title: item.title,
        href: item.href,
        id: item.dataset.id,
        previewImgSrc: projectNodes[idx].querySelector(".thumb img").src,
      })
    );

    // console.log(projectItems);

    return ({
      props: { items: projectItems }
    })
  } catch(err) {
    console.log(err);
    return ({ 
      props: { items: [] }   
    });
  }
  
}

