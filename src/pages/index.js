import Head from 'next/head';
import Link from "next/link";

// Unfortunately, JSDON seems to be incompatible with Netlify
const { parse } = require('node-html-parser');

const probe = require('probe-image-size');

import styles from '../styles/Home.module.css';
import {isNotEmptyArray, isNotEmptyString} from "../utils/checkers";

// https://freelance.habr.com/freelancers/Lazytech/projects
const baseUrl = "https://freelance.habr.com";

export default function Home(props) {
  const { items } = props;

  return (
    <>
      <Head>
        <title>Главная страница</title>
      </Head>

      <h1 className={styles.pageTitle}>
        Образцы работ веб-разработчика <a 
            href="https://freelance.habr.com/freelancers/Lazytech"
            className="external_link"
            style={{ wordBreak: 'normal' }}
            target="_blank"
            rel="noopener"
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
                      : <div className={styles.imageSubstitute} >
                          Без обложки
                        </div>
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

    const root = parse(fragment);
    const nodesArray = root.querySelectorAll(".project_item");
    
    const srcArray = root.querySelectorAll(".project_item .thumb img")
      .map((imageNode) => imageNode._attrs.src);

    const itemPromises = nodesArray.map(async (nodeItem, idx) => {
      const src = srcArray[idx];

      const item = {
        title: nodeItem._attrs.title,
        href: nodeItem._attrs.href,
        id: nodeItem._attrs["data-id"],
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

