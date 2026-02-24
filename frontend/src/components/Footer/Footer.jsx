import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerTop}>© 2026 Master Blaster Hub</div>
            <div className={styles.footerBottom}>WGU Software Engineering Capstone by James Kelly</div>
            <NavLink to="/tech-stack" className={styles.footerLink}>
                <span>Technology Stack and Deployment</span>
            </NavLink>
        </div>
    )
}
