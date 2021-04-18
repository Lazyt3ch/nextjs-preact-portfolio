import Head from 'next/head'
import styles from '../styles/Home.module.css'
const { JSDOM } = require('jsdom');
import Link from "next/link";

// https://freelance.habr.com/freelancers/Lazytech/projects
const baseUrl = "https://freelance.habr.com";

const isNotEmptyString = (str) => {
  if (typeof str !== 'string') return false;
  return (str.length > 0);
};

const isNotEmptyArray = (arr) => {
  if (!Array.isArray(arr)) return false;
  return (arr.length > 0);
}

export default function Home(props) {
  const { items } = props;

  console.log("Home: rendering data...");

  return (
    <>
      <Head />

      <h1 className={styles.pageTitle}>
        Образцы работ веб-разработчика <a 
            href="https://freelance.habr.com/freelancers/Lazytech"
            className="external_link"
          >
            Lazytech
          </a>
      </h1>
      <div className={styles.container}>
        { isNotEmptyArray(items)
          ? items.map((item, idx) =>
            <div className={styles.flexItem}
              key={item.id && item.id.length ? item.id : (-idx).toString()}
            >
              {/* <Link href={ `${baseUrl}${item.href}` } target="_blank"> */}
              <Link href={ `/projects/${item.id}` } target="_blank">
                <a 
                  className={styles.imageLink}
                >
                  <h2 className={styles.flexItemTitle}>{
                    isNotEmptyString(item.title) 
                      ? item.title 
                      : "Project title not found :("
                  }</h2>
                  <div className={styles.imageContainer}
                  >
                    { isNotEmptyString(item.imgSrc)
                      ? <img src={item.imgSrc} alt={item.title} />
                      // ? null
                      : <div>Preview Image not found :(</div>
                    }              
                  </div>
                </a>
              </Link>
            </div>
            )
          : <div>"No projects found :("</div>
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

    const dom = await new JSDOM(fragment);
    const document = dom.window.document;

    const nodes = await document.querySelectorAll(".project_item");

    const items = Array.from(nodes).map((item, idx) => ({
        title: item.title,
        href: item.href,
        id: item.dataset.id,
        imgSrc: nodes[idx].querySelector(".thumb img").src,
      })
    );

    // console.log(items[0]);

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

