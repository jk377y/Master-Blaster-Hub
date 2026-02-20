import React from 'react'
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <div className={styles.footer}>
        <div className={styles.footerTop}>© 2026 Master Blaster Hub</div>  
        <div className={styles.footerBottom}>Built with React & Spring Boot by James Kelly</div>
    </div>
  )
}
