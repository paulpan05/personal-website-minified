import type { NextPage } from 'next'
import Head from 'next/head'
import styles from './bibledevos.module.scss'

const AccountDeletion: NextPage = () => {
  return (
    <>
      <Head>
        <title>Account Deletion - BibleDevos</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Account Deletion</h1>
          <p><b>BibleDevos</b> by Paul Pan</p>

          <h2>How to Delete Your Account</h2>
          <p>
            You can delete your BibleDevos account and all associated data directly from the app:
          </p>
          <ul>
            <li><b>Step 1:</b> Open the BibleDevos app and sign in to your account.</li>
            <li><b>Step 2:</b> Tap the <b>Profile</b> tab at the bottom of the screen.</li>
            <li><b>Step 3:</b> Tap the <b>Delete Account</b> button.</li>
            <li><b>Step 4:</b> Confirm the deletion in the dialog that appears.</li>
          </ul>

          <h2>What Data Is Deleted</h2>
          <p>
            When you delete your account, the following data is <b>permanently deleted</b> from
            our servers:
          </p>
          <ul>
            <li>Your user profile (email, display name)</li>
            <li>All notes you created</li>
            <li>All Bible references attached to your notes</li>
            <li>All comments you posted</li>
            <li>All groups you created</li>
            <li>All group memberships</li>
            <li>All note shares (both sent and received)</li>
            <li>Your authentication credentials (sign-in account)</li>
          </ul>

          <h2>Data Retention</h2>
          <p>
            Account deletion is immediate and permanent. No data is retained after deletion.
            There is no recovery period — once deleted, your account and all associated data
            cannot be restored.
          </p>

          <h2>Can&apos;t Access the App?</h2>
          <p>
            If you are unable to access the app and would like to request account deletion,
            please email us at{' '}
            <a href='mailto:professional@panpaul.com'>professional@panpaul.com</a>{' '}
            with the subject line &quot;Account Deletion Request&quot; and the email address
            associated with your BibleDevos account. We will process your request and delete
            all associated data.
          </p>
        </div>
      </div>
    </>
  )
}

export default AccountDeletion
