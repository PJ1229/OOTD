import Link from "next/link";
import { FaTrophy, FaHome, FaPlusSquare, FaStore, FaTshirt } from "react-icons/fa";
import styles from "./Navbar.module.css"; // Adjust the path if your CSS module is elsewhere

export default function Navbar() {
  return (
    <nav className={styles.bottomNav}>
      <Link href="/protected/leaderboard" className={styles.iconLink}>
        <FaTrophy className={styles.icon} />
      </Link>
      <Link href="/protected/tryon" className={styles.iconLink}>
        <FaPlusSquare className={styles.icon} />
      </Link>
      <Link href="/protected/swipe" className={styles.iconLink}>
        <FaHome className={styles.icon} />
      </Link>
      <Link href="/protected/shop" className={styles.iconLink}>
        <FaStore className={styles.icon} />
      </Link>
      <Link href="/protected/favorites" className={styles.iconLink}>
        <FaTshirt className={styles.icon} />
      </Link>
    </nav>
  );
}
