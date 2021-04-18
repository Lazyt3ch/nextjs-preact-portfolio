import Head from 'next/head'
import styles from '../../styles/Project.module.css';

import { useRouter } from 'next/router';
const { JSDOM } = require('jsdom');

// https://freelance.habr.com/freelancers/Lazytech/projects
// https://freelance.habr.com/projects/221255
const baseUrl = "https://freelance.habr.com";

export default function Project() {
  const router = useRouter();
  const { id } = router.query;

  return (

    <>
      <Head />

      <div>
        DEBUG
        <br />
        Post: {id}
      </div>


    </>
  );


}


export async function getServerSideProps() {
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

    const description = await document.querySelector("div.description").textContent;
    console.log("description", description);
    info.description = description;

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
