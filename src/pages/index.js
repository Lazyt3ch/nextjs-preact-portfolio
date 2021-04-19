import Head from 'next/head'
import styles from '../styles/Home.module.css'

const { JSDOM } = require('jsdom');
const probe = require('probe-image-size');

import Link from "next/link";
import {isNotEmptyArray, isNotEmptyString} from "../utils/checkers";

// https://freelance.habr.com/freelancers/Lazytech/projects
const baseUrl = "https://freelance.habr.com";

export default function Home(props) {
  const { items } = props;

  console.log("Home: rendering data...");

  return (
    <>
      <Head>
        <title>Главная страница</title>
      </Head>

      <h1 className={styles.pageTitle}>
        Образцы работ веб-разработчика <a 
            href="https://freelance.habr.com/freelancers/Lazytech"
            className="external_link"
            target="_blank"
          >
            Lazytech
          </a>
      </h1>

      <div className={styles.projectsContainer}>
        { isNotEmptyArray(items)
          ? items.map((item, idx) =>
            <div className={styles.flexItem}
              key={item.id && item.id.length ? item.id : (-idx).toString()}
            >
              <Link href={ `/projects/${item.id}` } target="_blank">
                <a 
                  className={styles.imageLink}
                >
                  <div className={styles.imageContainer}
                  >
                    { isNotEmptyString(item.src)
                      ? <img src={item.src} alt={item.title} 
                          width={item.width} height={item.height} 
                          className={styles.image}
                        />
                      : <div>Preview image not found :(</div>
                    }              
                  </div>
                </a>
              </Link>
              <h2 className={styles.flexItemTitle}>{
                isNotEmptyString(item.title) 
                  ? item.title 
                  : "Project title not found :("
              }</h2>
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
    const nodesArray = Array.from(nodes);

    const itemPromises = nodesArray.map(async (nodeItem, idx) => {
      const src = nodes[idx].querySelector(".thumb img").src;

      const item = {
        title: nodeItem.title,
        href: nodeItem.href,
        id: nodeItem.dataset.id,
        src,
      };
      
      // Default image size (freelance.habr.com specific height & width)
      let height = 300;
      let width = 400;

      // Get image width and height
      const imageInfo = await probe(src);

      height = imageInfo.height || height;
      width = imageInfo.width || width;      

      item.height = imageInfo.height || height;
      item.width = imageInfo.width || width;      
      
      return item;
    });

    const items = await Promise.all(itemPromises);

    // const imageNodes = await document.querySelectorAll("div.images > img");

    // const imageItems = Array.from(imageNodes);

    // const imagePromises = imageItems.map(async (node) => {
    //   const src = node.src;

    //   // Default image size
    //   let height = 800;
    //   let width = 1000;

    //   // Get image width and height
    //   const imageInfo = await probe(src);

    //   height = imageInfo.height || height;
    //   width = imageInfo.width || width;

    //   return {
    //     src,
    //     height,
    //     width,
    //   };
    // });

    // const images = await Promise.all(imagePromises);
        

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

