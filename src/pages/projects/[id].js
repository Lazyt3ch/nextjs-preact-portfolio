import Head from 'next/head'
import styles from '../../styles/Project.module.css';

import { useRouter } from 'next/router';
const { JSDOM } = require('jsdom');

import { isNotEmptyArray, isNotEmptyString } from "../../utils/checkers";

// https://freelance.habr.com/freelancers/Lazytech/projects
// https://freelance.habr.com/projects/221255
const baseUrl = "https://freelance.habr.com";

export default function Project({info}) {
  const router = useRouter();
  const { id } = router.query;
  
  console.log("info", info);

  const { title, description, images } = info;
  
  return (
    <>
      <Head />

      <div>
        DEBUG
        <br />
        Post: {id}
      </div>

      <div>
        <h1>{ title }</h1>

        { description && isNotEmptyArray(description) && 
          <div>
            {
              description.map(({type, content}, idx) => 
                type === 'text'
                  ? (<p key={idx}>
                      {content}
                    </p>)
                  : type === 'url'
                    ? (<a href={content} className="external_link" 
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

    // const description = await document.querySelector("div.description").textContent;
    // console.log("description =", description);
    // info.description = description;

    // const descriptionNodes = await document.querySelectorAll("div.description *");
    // // console.log("descriptionNodes =", descriptionNodes);
    // const descriptionItems = Array.from(descriptionNodes);
    // console.log("descriptionItems =", descriptionItems);
    


    const brObj = {
      type: 'br',
      content: null,
    };

    const descriptionNode = await document.querySelector("div.description");
    let description = Array.from(descriptionNode.childNodes)
      // .filter((child) => {
      //   if (child.nodeType === 3) { // Node.TEXT_NODE
      //     return true;
      //   }

      //   if (child.tagName === "A") {
      //     return true;
      //   }

      //   if (child.tagName === "BR") {
      //     return true;
      //   }        

      //   return false;          
      // })
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
    if (description[0] && description[0].type === 'url' 
        && description[1] && description[1].type !== 'br') {
      description = description.splice(1, 0, brObj);
    }

    // Remove <br> that immediately precedes <a ...>
    // if (description.length > 3) {
    //   for (let i = description.length - 2; i > 1; i--) {
    //     console.log(description[i], description[i].type);
    //     if (description[i].type === 'br' 
    //       && description[i + 1].type === 'url'
    //       && description[i - 1].type === 'text'
    //       ) {
    //       description = description.splice(i, 1);
    //     }
    //   }  
    // }

    console.log("description =", description);
    info.description = description;

    // description.forEach((child) => {
    //   console.log(child, " ==== ", child.nodeType);
    // });

    const imageNodes = await document.querySelectorAll("div.images > img");
    const images = Array.from(imageNodes).map((node) => node.src);
    console.log("images", images);
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
