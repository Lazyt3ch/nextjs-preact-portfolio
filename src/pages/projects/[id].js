import Head from 'next/head'
import styles from '../../styles/Project.module.css';

import { useRouter } from 'next/router';

const { JSDOM } = require('jsdom');
const probe = require('probe-image-size');

import { isNotEmptyArray, isNotEmptyString } from "../../utils/checkers";

// https://freelance.habr.com/freelancers/Lazytech/projects
// https://freelance.habr.com/projects/221255
const baseUrl = "https://freelance.habr.com";

export default function Project({info}) {
  const router = useRouter();
  const { id } = router.query;
  
  // console.log("info", info);

  const { title, description, images } = info;
  
  return (
    <>
      <Head />

      {/* <div>
        DEBUG
        <br />
        Post: {id}
      </div> */}

      <h1 className={styles.pageTitle}>{ title }</h1>

      <div className={styles.container}>        

        { description && isNotEmptyArray(description) && 
          <div className={styles.description}>
            { description[0].type === 'url' &&
              <div>Работающее веб-приложение:</div>
            }

            {
              description.map(({type, content}, idx) => 
                type === 'text'
                  ? (<p key={idx}>
                      {content}
                    </p>)
                  : type === 'url'
                    ? (<a href={content} className="external_link" 
                        target="_blank"
                        style={{display: "block"}}
                        key={idx}
                      >
                        {content}
                      </a>)
                    : type === 'br' && (idx === 0 || description[idx - 1].type !== 'br')
                      ? <br key={idx} />
                      : null
              )
            }
          </div>
        }

        { images && isNotEmptyArray(images) && 
          images.map(({src, width, height}) => 
            <div className={styles.imageContainer}>
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
  // console.log("PROJECTS: getServerSideProps");
  // console.log("context", context);

  const { id } = context.query;
  // console.log("getServerSideProps:  id", id);

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

    const dom = await new JSDOM(fragment);
    const document = dom.window.document;

    const title = await document.querySelector("h1.name").textContent;
    info.title = title;

    const brObj = {
      type: 'br',
      content: null,
    };

    const descriptionNode = await document.querySelector("div.description");
    let description = Array.from(descriptionNode.childNodes)
      .map((child) => {
        if (child.nodeType === 3) { // Node.TEXT_NODE
          return ({
            type: 'text',
            content: child.textContent,
          });
        }

        if (child.tagName === "A") {
          return ({
            type: 'url',
            content: child.href,
          });
        }        

        if (child.tagName === "BR") {
          return brObj;
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
        // console.log(i, description[i], description[i].type);
        
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

    // console.log("description =", description);
    info.description = description;

    // description.forEach((child) => {
    //   console.log(child, " ==== ", child.nodeType);
    // });

    const imageNodes = await document.querySelectorAll("div.images > img");

    const imageItems = Array.from(imageNodes);

    const imagePromises = imageItems.map(async (node) => {
      const src = node.src;

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
