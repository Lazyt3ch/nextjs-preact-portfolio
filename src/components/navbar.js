import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const { pathname } = router;
  console.log("pathname =", pathname);

  const paths = [
    { subUrl: "/", text: "На главную", },
    { subUrl: "/about", text: "О проекте", },
  ];

  return (
    <div className={styles.navbar}>
      { paths.map(({subUrl, text}, idx) => 
          <Link href={subUrl} key={idx}>
            { subUrl === pathname
              ? <span className="current_link">{text}</span>
              : <a className="external_link">{text}</a>
            }        
          </Link>
      )}
    </div>
  );
};