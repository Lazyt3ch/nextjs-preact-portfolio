import Head from 'next/head'
import styles from '../styles/Home.module.css'
const { JSDOM } = require('jsdom');

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
  // console.log(props);
  const { items } = props;
  console.log("Home: items, items[0]", items[0]);

  // if (isNotEmptyArray(items)) {
  //   console.log(items[0].href);
  //   console.log(items[0].href.length);
  //   console.log(`${baseUrl}${items[0].href}`);
  //   console.log(Array.isArray(items));
  //   console.log(items.length); 
  // }

  console.log("Home: rendering data...");

  return (
    <>
      <Head />

      <h1>DEBUG</h1>
      <div>
        {items.map((item, idx) => {
            <div>{item.title} -- {idx}</div>
          })
        }
      </div>

      {/* <h1 className="align-center">Образцы работ фрилансера Lazytech</h1>
      <div className={styles.container}>
        { isNotEmptyArray(items)
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
      </div> */}
    </>
  )
}

// export async function getStaticProps() {
export async function getServerSideProps() {
  try {

    // 2debug
    return ({ props: {
      items:
        [
          {
            href: "/projects/226637",
            id: "226637",
            imgSrc: "https://habrastorage.org/getpro/freelansim/allfiles/75/758/758673/preview_d29a6d5616.png",
            title: "Мокап-проект, сделанный на React по готовым макетам (Figma)",
          },
        ] 
      }
    });

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

    console.log(items[0]);

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

