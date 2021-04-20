import Head from 'next/head';
import { useRouter } from 'next/router';;

import React from 'react';

// Unfortunately, JSDON seems to be incompatible with Netlify
const { parse } = require('node-html-parser');

const probe = require('probe-image-size');

import styles from '../../styles/Project.module.css';
import { isNotEmptyArray, isNotEmptyString } from "../../utils/checkers";
import { decodeHTMLEntities } from "../../utils/decodeEntities";

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
              <div>Работающее веб-приложение:</div>
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
                      : type === 'br' && (idx === 0 || description[idx - 1].type !== 'br')
                        ? <br />
                        : null
                  }
                </React.Fragment>
              )
            }
          </div>
        }

        { images && isNotEmptyArray(images) && 
          images.map(({src, width, height}, idx) => 
            <div className={styles.imageContainer} key={idx}>
              <img src={src} alt="title" 
                className={styles.image}
                width={width} height={height}
                loading="lazy"
              />
            </div>
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

    // const descriptionSubnodes = root.querySelectorAll("div.description *");
    // console.log("descriptionSubnodes.length =", descriptionSubnodes.length);
    const descriptionNode = root.querySelector("div.description");
    const hrefRegex = /href\s*=\s*['"](\S+)['"]/;
    
    // let description = descriptionSubnodes
    let description = descriptionNode.childNodes
      .map((child) => {
        // console.log("\n child = \n", child);

        if (child.nodeType === 3) { // Node.TEXT_NODE
          // console.log("\n child = \n", child);
          return ({
            type: 'text',
            // content: child.textContent,
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
            // content: child._attrs.href,
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
    const srcRegex = /src\s*=\s*['"](\S+)['"]/;

    const imagePromises = imageItems.map(async (node) => {
      // console.log("imagePromises:  node =\n", node);
      const src = node.rawAttrs.match(srcRegex)[1];
      // src = src="https://habrastorage.org/getpro/freelansim/allfiles/75/758/758671/92f7817d2b.png" alt="92f7817d2b"
      // console.log("MATCHED: src =", src);

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
    
    // console.log("images", images);
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
