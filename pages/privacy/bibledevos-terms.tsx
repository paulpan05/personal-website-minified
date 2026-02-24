import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from './bibledevos.module.scss'

const Terms: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - BibleDevos</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Terms of Service</h1>
          <p><b>BibleDevos</b></p>
          <p>Effective date: February 23, 2026</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By downloading, installing, or using BibleDevos, you agree to these Terms of Service.
            If you do not agree, do not use the app.
          </p>

          <h2>Description of Service</h2>
          <p>
            BibleDevos is a Bible study app that lets you read Scripture, create study notes with
            linked Bible references, share notes with other users and study groups, and collaborate
            through comments. The app is available on iOS and Android.
          </p>

          <h2>Account Registration</h2>
          <p>
            You must create an account to use BibleDevos. You can sign in with email, Google, or
            Apple. You are responsible for maintaining the security of your account and for all
            activity that occurs under it.
          </p>

          <h2>User Content</h2>
          <p>
            You retain ownership of all notes, comments, and other content you create in BibleDevos.
            By sharing content with other users, groups, or making it public, you grant those
            recipients permission to view and comment on that content within the app.
          </p>
          <p>
            You agree not to post content that is:
          </p>
          <ul>
            <li>Unlawful, harassing, abusive, or threatening</li>
            <li>Obscene or offensive</li>
            <li>Infringing on the intellectual property rights of others</li>
            <li>Spam, advertising, or solicitation</li>
          </ul>
          <p>
            We reserve the right to remove content that violates these terms.
          </p>

          <h2>Bible Text</h2>
          <p>
            BibleDevos includes the King James Version (KJV) and American Standard Version (ASV)
            of the Bible. Both translations are in the public domain.
          </p>

          <h2>Acceptable Use</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the app for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to the app or its systems</li>
            <li>Interfere with or disrupt the app&apos;s functionality</li>
            <li>Impersonate another person or misrepresent your identity</li>
            <li>Use automated means to access the app (bots, scrapers, etc.)</li>
          </ul>

          <h2>Account Termination</h2>
          <p>
            You may delete your account at any time from the Profile screen in the app. We may
            suspend or terminate your account if you violate these terms. See our{' '}
            <Link href='/privacy/bibledevos-account-deletion'>Account Deletion</Link> page for details
            on what data is removed.
          </p>

          <h2>Availability</h2>
          <p>
            We strive to keep BibleDevos available at all times, but we do not guarantee
            uninterrupted access. The app may be temporarily unavailable due to maintenance,
            updates, or circumstances beyond our control.
          </p>

          <h2>Disclaimer of Warranties</h2>
          <p>
            BibleDevos is provided &quot;as is&quot; without warranties of any kind, express or
            implied. We do not warrant that the app will be error-free, secure, or available at
            all times.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, we shall not be liable for any indirect,
            incidental, special, or consequential damages arising from your use of BibleDevos,
            including loss of data or content.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Changes will be posted on this page with
            an updated effective date. Continued use of the app after changes constitutes acceptance
            of the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these terms, contact us at{' '}
            <a href='mailto:professional@panpaul.com'>professional@panpaul.com</a>.
          </p>
        </div>
      </div>
    </>
  )
}

export default Terms
