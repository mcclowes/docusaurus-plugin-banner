import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'

export default function Home() {
  return (
    <Layout title="Home" description="docusaurus-plugin-banner example site">
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>docusaurus-plugin-banner example</h1>
        <p>A Docusaurus v3 site demonstrating the banner plugin.</p>
        <Link className="button button--primary button--lg" to="/docs/intro">
          View the docs
        </Link>
      </main>
    </Layout>
  )
}
