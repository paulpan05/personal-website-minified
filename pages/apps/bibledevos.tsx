import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from './bibledevos.module.scss'

const BibleDevos: NextPage = () => {
  return (
    <>
      <Head>
        <title>BibleDevos - Bible Notes &amp; Study Groups</title>
        <meta name='description' content='Share Bible study notes linked to scripture references with friends and study groups. Read, reflect, and collaborate together.' />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>BibleDevos</h1>
          <p className={styles.tagline}>Bible Notes &amp; Study Groups</p>

          <p>
            Share Bible study notes linked to scripture references with friends, study groups,
            and the world. Whether you&apos;re preparing for a small group, journaling through a
            book of the Bible, or sharing a devotional insight with a friend, BibleDevos keeps
            your reflections connected to the text.
          </p>

          <div className={styles.badges}>
            <a className={styles.badge} href='https://apps.apple.com/app/bibledevos' target='_blank' rel='noopener noreferrer'>
              Download on the App Store
            </a>
            <a className={styles.badge} href='https://play.google.com/store/apps/details?id=com.paulpan.bibledevos' target='_blank' rel='noopener noreferrer'>
              Get it on Google Play
            </a>
          </div>

          <h2>Notes Rooted in Scripture</h2>
          <p>
            Every note you write can be linked to one or more Bible references &mdash; a single
            verse, a range, or even a cross-chapter passage. Tap any reference to read the full
            scripture text with your selected verses highlighted. Your notes are never disconnected
            from the Word that inspired them.
          </p>

          <h2>Share and Collaborate</h2>
          <p>
            Share notes directly with other users or with study groups you create. Shared notes
            include all attached references, so recipients can read the exact passages you&apos;re
            reflecting on. Add real-time comments to start a conversation around any note.
          </p>

          <h2>Study Groups</h2>
          <p>
            Create groups for your Bible study, small group, or accountability circle. Invite
            members, share notes to the group, and keep everyone on the same page. Group admins
            manage membership while all members can view and comment on shared notes.
          </p>

          <h2>Discover Public Notes</h2>
          <p>
            Toggle any note public to share your insights with the wider community. Browse public
            notes from other users to find fresh perspectives on familiar passages.
          </p>

          <h2>Built-in Bible Reader</h2>
          <p>
            Read the KJV and ASV translations right inside the app. Navigate by book and chapter,
            select verses to create a new note or add them to an existing one, and never lose your place.
          </p>

          <h2>Offline Ready</h2>
          <p>
            All your notes, references, groups, and shares are cached locally. Open the app
            without an internet connection and pick up right where you left off.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Create notes with linked Bible references (single verse, ranges, cross-chapter)</li>
            <li>Tap any reference to read the full passage with highlighted verses</li>
            <li>Select verses in the Bible reader to start a new note or add to an existing one</li>
            <li>Share notes with individual users or study groups</li>
            <li>Real-time comments on shared notes</li>
            <li>Create and manage study groups with admin and member roles</li>
            <li>Publish notes for all users to discover</li>
            <li>Read KJV and ASV translations offline</li>
            <li>Secure sign-in with email, Google, or Apple</li>
          </ul>

          <div className={styles.links}>
            <Link href='/privacy/bibledevos-terms'>Terms of Service</Link>
            <Link href='/privacy/bibledevos'>Privacy Policy</Link>
            <Link href='/privacy/bibledevos-account-deletion'>Account Deletion</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default BibleDevos
