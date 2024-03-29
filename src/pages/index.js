import Head from 'next/head';
import Link from "next/link";

// Unfortunately, JSDON seems to be incompatible with Netlify
const { parse } = require('node-html-parser');

const probe = require('probe-image-size');

import styles from '../styles/Home.module.css';
import {isNotEmptyArray, isNotEmptyString} from "../utils/checkers";
import {getRegex} from "../utils/getRegex";

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
                  tabIndex="0"
                >
                  <div className={styles.imageContainer}>
                    { isNotEmptyString(item.src)
                      ? <figure>
                          <img src={item.src} alt={item.title} 
                            width={item.width} height={item.height} 
                            className={styles.image}
                          />
                          <figcaption className={styles.flexItemTitle}>
                            {
                              isNotEmptyString(item.title) 
                              ? item.title 
                              : "Название проекта не найдено :("
                            }
                          </figcaption>
                        </figure>
                      : <div className={styles.imageSubstitute} >
                          Без обложки
                        </div>
                    }              
                  </div>
                </a>
              </Link>
              { !isNotEmptyString(item.src) &&
                <h2 className={styles.flexItemTitle}>{
                  isNotEmptyString(item.title) 
                    ? item.title 
                    : "Название проекта не найдено :("
                }</h2>
              }              
            </div>
            )
          : <div>Проектов не найдено :(</div>
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

    // const classRegex = /class\s*=\s*['"](\S+)['"]/;
    // const srcRegex = /src\s*=\s*['"](\S+)['"]/;
    const classRegex = getRegex("class");
    const srcRegex = getRegex("src");
    let src;
    let thumbNode;
    let imageNode;

    const itemPromises = nodesArray.map(async (nodeItem, idx) => {
      src = "";
      thumbNode = null;
      imageNode = null;

      const childNodes = nodeItem.childNodes;

      // Get class="thumb" element that contains the img element
      for (let i = childNodes.length - 1; i >= 0; i--) {
        let rawAttrs = childNodes[i].rawAttrs;
        if (rawAttrs) {
          let childNodeClassMatch = rawAttrs.match(classRegex);
          if (childNodeClassMatch && childNodeClassMatch[1].toLowerCase() === "thumb") {
            thumbNode = childNodes[i];
            break;
          }
        }
      }

      // Get src of the img element
      if (thumbNode) {
        const subNodes = thumbNode.childNodes;
        for (let i = subNodes.length - 1; i >= 0; i--) {
          if (subNodes[i].rawTagName && subNodes[i].rawTagName.toLowerCase() === 'img') {
            src = subNodes[i].rawAttrs.match(srcRegex)[1];
            break;
          }
        }
      }

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

