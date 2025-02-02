import Link from "next/link";
import { FaTrophy, FaHome, FaPlusSquare, FaStore, FaCamera } from "react-icons/fa";
import styles from "./Navbar.module.css"; // Adjust the path if your CSS module is elsewhere

export default function Navbar() {
  return (
    <nav className={styles.bottomNav}>
      <Link href="/profile" className={styles.iconLink}>
        <FaTrophy className={styles.icon} />
      </Link>
      <Link href="/" className={styles.iconLink}>
        <FaHome className={styles.icon} />
      </Link>
      <Link href="/add" className={styles.iconLink}>
        <FaPlusSquare className={styles.icon} />
      </Link>
      <Link href="/market" className={styles.iconLink}>
        <FaStore className={styles.icon} />
      </Link>
      <Link href="/camera" className={styles.iconLink}>
        <FaCamera className={styles.icon} />
      </Link>
    </nav>
  );
}
