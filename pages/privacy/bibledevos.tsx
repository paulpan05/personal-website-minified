import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from './bibledevos.module.scss'

const Privacy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - BibleDevos</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Privacy Policy</h1>
          <p><b>BibleDevos</b></p>
          <p>Effective date: February 23, 2026</p>

          <h2>Overview</h2>
          <p>
            BibleDevos is a Bible study app that lets you read Scripture, create study notes,
            and share them with others. This policy explains what data we collect, how we use it,
            and your choices.
          </p>

          <h2>Data We Collect</h2>
          <p>
            <b>Account information:</b> When you sign up, we collect your email address and
            display name. If you sign in with Google or Apple, we receive your name and email
            from those providers.
          </p>
          <p>
            <b>Content you create:</b> Notes, comments, Bible references, groups, and sharing
            activity are stored on our servers so you can access them across devices.
          </p>
          <p>
            <b>We do not collect:</b>
          </p>
          <ul>
            <li>Location data</li>
            <li>Contacts or phone data</li>
            <li>Analytics or advertising identifiers</li>
            <li>Financial or payment information</li>
          </ul>

          <h2>How We Use Your Data</h2>
          <ul>
            <li>To provide and maintain the app&apos;s functionality</li>
            <li>To let other users find you by email or display name when sharing notes or groups</li>
            <li>To display your name on notes and comments you share</li>
          </ul>

          <h2>Data Storage and Security</h2>
          <p>
            Your data is stored securely using Amazon Web Services (AWS). Authentication is
            handled by AWS Cognito, and all data is transmitted over encrypted connections (HTTPS).
          </p>

          <h2>Data Sharing</h2>
          <p>
            We do not sell, trade, or share your personal data with third parties. Your content
            is only visible to users you explicitly share it with, or to all users if you choose
            to make a note public.
          </p>

          <h2>Your Choices</h2>
          <ul>
            <li>You can update your display name at any time in the app.</li>
            <li>You can delete individual notes, comments, and groups.</li>
            <li>You can delete your entire account from the Profile screen, which permanently
              removes all your data from our servers.</li>
          </ul>

          <h2>Children&apos;s Privacy</h2>
          <p>
            BibleDevos is not directed at children under 13. We do not knowingly collect data
            from children under 13.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page
            with an updated effective date.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, contact us at{' '}
            <a href='mailto:professional@panpaul.com'>professional@panpaul.com</a>.
          </p>

          <div className={styles.backLink}>
            <Link href='/'>&#8592; Back to home</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Privacy
