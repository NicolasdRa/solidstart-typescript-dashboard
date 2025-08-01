import { A } from "@solidjs/router";
import { Title, Meta } from '@solidjs/meta';
import styles from './[...404].module.css';

export default function NotFound() {
  return (
    <>
      <Title>Page Not Found - SolidStart Dashboard</Title>
      <Meta name="description" content="The page you are looking for could not be found. Return to the dashboard or explore other sections of the application." />
      <Meta property="og:title" content="Page Not Found - SolidStart Dashboard" />
      <Meta property="og:description" content="The page you are looking for could not be found. Return to the dashboard or explore other sections of the application." />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content="Page Not Found - SolidStart Dashboard" />
      <Meta name="twitter:description" content="The page you are looking for could not be found. Return to the dashboard or explore other sections of the application." />
      
      <main class={styles.container}>
      <h1 class={styles.title}>Not Found</h1>
      <p class={styles.content}>
        <span class={styles.contentText}>Visit{" "}</span>
        <a href="https://solidjs.com" target="_blank" class={styles.link}>
          solidjs.com
        </a>
        <span class={styles.contentText}>{" "}to learn how to build Solid apps.</span>
      </p>
      <p class={styles.navigation}>
        <A href="/" class={styles.link}>
          Home
        </A>
        <span class={styles.navSeparator}>{" - "}</span>
        <A href="/about" class={styles.link}>
          About Page
        </A>
      </p>
      </main>
    </>
  );
}
