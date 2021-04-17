import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home({ body }) {
  return (
    <div style={{width: "100vw"}}>
      { body }
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://freelance.habr.com/freelancers/Lazytech/projects", 
      { 
        method: "GET",
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );

    const text = await res.text();

    const fragmentStart = text.indexOf("<dl ");
    const fragmentEnd = text.indexOf("</dl>", fragmentStart + 4);
    const fragment = text.slice(fragmentStart, fragmentEnd + 5);

    return ({
      props: { body: fragment }
    })
  } catch(err) {
    console.log(err);
    return ({ 
      props: { body: "" }   
    });
  }
  
}

