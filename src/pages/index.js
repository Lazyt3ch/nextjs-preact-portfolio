import Head from 'next/head'
import styles from '../styles/Home.module.css'
const { JSDOM } = require('jsdom');

const baseUrl = "https://freelance.habr.com";

const isNotEmptyString = (str) => {
  if (typeof str !== 'string') return false;
  return (str.length > 0);
};

export default function Home({ items }) {
  console.log(items);
  console.log(items[0].href);
  console.log(items[0].href.length);
  console.log(`${baseUrl}${items[0].href}`);

  return (
    <>
      <Head />
      <h1>DEBUG</h1>
      <div>{items.map((item, idx) => {
        <div>{item.title} -- {idx}</div>
      })}
      </div>
      <h1 className="align-center">Образцы работ фрилансера Lazytech</h1>
      <div className={styles.container}>
        { items && items.length
          ? items.map((item, idx) =>
            { isNotEmptyString(item.href) &&
              <div key={item.id && item.id.length ? item.id : (-idx).toString()}>
                <a href={ `${baseUrl}${item.href}` } target="_blank">
                  <div>{
                    isNotEmptyString(item.title) 
                      ? item.title 
                      : "Project title not found :("
                  }</div>
                  { isNotEmptyString(item.imgSrc)
                    ? <img src={item.imgSrc} alt={item.title} />
                    : <div>Preview Image not found :(</div>
                  }              
                </a>
              </div>
            })
          : "No projects found :("
        }
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${baseUrl}/freelancers/Lazytech/projects`, 
      { 
        method: "GET",
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );

    const text = await res.text();

    const start = text.indexOf("<dl ");
    const end = text.indexOf("</dl>", start + 4);
    const fragment = text.slice(start, end + 5);

    const dom = new JSDOM(fragment);
    const document = dom.window.document;

    const nodes = document.querySelectorAll(".project_item");

    const items = Array.from(nodes).map((item, idx) => ({
        title: item.title,
        href: item.href,
        id: item.dataset.id,
        imgSrc: nodes[idx].querySelector(".thumb img").src,
      })
    );

    // console.log(projectItems);

    return ({
      props: { items }
    })
  } catch(err) {
    console.log(err);
    return ({ 
      props: { items: [] }   
    });
  }
  
}

