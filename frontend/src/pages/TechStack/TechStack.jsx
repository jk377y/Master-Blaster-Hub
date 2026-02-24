import styles from './TechStack.module.css';

export const TechStack = () => {
    return (
        <div className={styles.container}>
            <h2>Technology Stack & Deployment</h2>
            <p className={styles.description}>
                Master Blaster Hub is a full-stack web application built with a modern
                React frontend and a Spring Boot backend, deployed to AWS using
                containerized infrastructure.
            </p>

            <div className={styles.cardGroup}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Frontend</h3>
                    <ul>
                        <li>React 19</li>
                        <li>React Router DOM</li>
                        <li>JWT Decode</li>
                        <li>Vite (Build Tool)</li>
                        <li>CSS Modules</li>
                        <li>Responsive Design (Media Queries)</li>
                        <li>Fetch API for REST Communication</li>
                    </ul>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Backend</h3>
                    <ul>
                        <li>Java 21</li>
                        <li>Spring Boot 4.0.2</li>
                        <li>Spring Web MVC</li>
                        <li>Spring Security</li>
                        <li>Spring Data MongoDB</li>
                        <li>Spring Validation</li>
                        <li>JWT (JJWT 0.11.5)</li>
                        <li>MongoDB Atlas</li>
                        <li>Maven</li>
                    </ul>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Deployment & Infrastructure</h3>
                    <ul>
                        <li>AWS S3 (Static Frontend Hosting)</li>
                        <li>AWS CloudFront (CDN)</li>
                        <li>AWS ECS (Elastic Container Service)</li>
                        <li>AWS Fargate (Container Orchestration)</li>
                        <li>AWS ECR (Container Registry)</li>
                        <li>AWS Route 53 (DNS Management)</li>
                        <li>Docker (Backend Containerization)</li>
                    </ul>
                </div>
            </div>

        </div>
    );
};