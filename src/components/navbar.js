import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const { pathname } = router;
  console.log(pathname);

  return (
    <div className={styles.navbar}>
      <Link href="/">
        { pathname === "/"
          ? <span>На главную</span>
          : <a className="external_link">На главную</a>
        }        
      </Link>

      <Link href="/about">
        { pathname === "/about"
          ? <span>О проекте</span>
          : <a className="external_link">О проекте</a>
        }        
      </Link>
    </div>
  );
};