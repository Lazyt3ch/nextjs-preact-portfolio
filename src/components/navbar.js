import styles from "../styles/Navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <Link href="/">
        <a className="external_link">На главную</a>
      </Link>
    </div>
  );
};