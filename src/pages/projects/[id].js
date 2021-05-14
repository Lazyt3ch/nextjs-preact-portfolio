import Head from 'next/head';
import { useRouter } from 'next/router';;

import React from 'react';

// Unfortunately, JSDON seems to be incompatible with Netlify
const { parse } = require('node-html-parser');

const probe = require('probe-image-size');

import styles from '../../styles/Project.module.css';
import { isNotEmptyArray, isNotEmptyString } from "../../utils/checkers";
import { decodeHTMLEntities } from "../../utils/decodeEntities";
import { getRegex } from "../../utils/getRegex";

// https://freelance.habr.com/freelancers/Lazytech/projects
// https://freelance.habr.com/projects/221255
const baseUrl = "https://freelance.habr.com";

export default function Project({info}) {
  const router = useRouter();
  const { id } = router.query;

  const { title, description, images } = info;
 
  return (
    <>
      <Head>
        <title>Образец работы | {title}</title>
      </Head>

      <h1 className={styles.pageTitle}>{ title }</h1>

      <div className={styles.container}>        

        { description && isNotEmptyArray(description) && 
          <div className={styles.description}>
            { description[0].type === 'url' &&
              <p>Работающее веб-приложение:</p>
            }

            {
              description.map(({type, content}, idx) => 
                <React.Fragment key={idx}>
                  { type === 'text'
                    ? (<p>
                        {content}
                      </p>)
                    : type === 'url'
                      ? (<a href={content} className="external_link" 
                          target="_blank"
                          rel="noopener"
                          style={{display: "block"}}
                        >
                          {content}
                        </a>)
                      : null
                      // : type === 'br' && (idx === 0 || description[idx - 1].type !== 'br')
                      //   ? <br />
                      //   : null
                  }
                </React.Fragment>
              )
            }
          </div>
        }

        { images && isNotEmptyArray(images) && 
          images.map(({src, width, height}, idx) => 
            <figure className={styles.imageContainer} key={idx}>
              <img src={src} 
                alt={`Иллюстрация ${idx + 1}`} 
                className={styles.image}
                width={width} height={height}
                loading={idx > 0 ? "lazy" : "eager"}
              />
            </figure>
          )
        }

      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const info = {};

  try {
    const res = await fetch(
      `${baseUrl}/projects/${id}`, 
      { 
        method: "GET",
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );

    const text = await res.text();

    const opener = "<main ";
    const closer = "</main>";

    const start = text.indexOf(opener);
    const end = text.indexOf(closer, start + opener.length);
    const fragment = text.slice(start, end + closer.length);

    const root = parse(fragment);
    const title = root.querySelector("h1.name").textContent;
    info.title = title;

    const brObj = {
      type: 'br',
      content: null,
    };

    const descriptionNode = root.querySelector("div.description");
    // const hrefRegex = /href\s*=\s*['"](\S+)['"]/;
    const hrefRegex = getRegex("href");
    
    let description = descriptionNode.childNodes
      .map((child) => {
        if (child.nodeType === 3) { // Node.TEXT_NODE
          return ({
            type: 'text',
            content: decodeHTMLEntities(child.text), 
          });
        }

        const tagName = child.rawTagName.toUpperCase();

        if (tagName === "BR") {
          return brObj;
        }          

        if (tagName === "A") {
          return ({
            type: 'url',
            content: child.rawAttrs.match(hrefRegex)[1],
          });
        }        
        
        return brObj;
      });

    // Add <br> after <a ...> located at 0th position
    // if (description[0] && description[0].type === 'url' 
    //     && description[1] && description[1].type !== 'br') {
    //   description.splice(1, 0, brObj);
    // }

    if (description.length > 3) {
      for (let i = description.length - 2; i > 1; i--) {
        if (description[i].type === 'br' 
          && (description.length >= i && description[i + 1].type === 'url')
          && description[i - 1].type === 'text'
          ) { // Remove <br> that immediately precedes <a ...> and immediately follows TEXT
          description.splice(i, 1);
          continue;
        } 
        
        if (description[i].type === 'br'  
          && (description.length >= i && description[i + 1].type === 'br')) {
            // Remove <br> that precedes another <br>
            description.splice(i, 1);      
        }  
      }  
    }

    info.description = description;

    const imageItems = root.querySelectorAll("div.images > img");
    // const srcRegex = /src\s*=\s*['"](\S+)['"]/;
    const srcRegex = getRegex("src");

    const imagePromises = imageItems.map(async (node) => {
      const src = node.rawAttrs.match(srcRegex)[1];
      // src = src="https://habrastorage.org/getpro/freelansim/allfiles/75/758/758671/92f7817d2b.png" alt="92f7817d2b"

      // Default image size
      let height = 800;
      let width = 1000;

      // Get image width and height
      const imageInfo = await probe(src);

      height = imageInfo.height || height;
      width = imageInfo.width || width;

      return {
        src,
        height,
        width,
      };
    });

    const images = await Promise.all(imagePromises);
    
    info.images = images;
  } 
  catch(err) {
    console.log(err);
  }
  finally {
    return ({ 
      props: { info }   
    });
  }
  
}
