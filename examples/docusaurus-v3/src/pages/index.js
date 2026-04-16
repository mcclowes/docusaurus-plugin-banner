import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'

export default function Home() {
  return (
    <Layout title="Banner Plugin Example" description="Example site for docusaurus-plugin-banner">
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          textAlign: 'center',
        }}
      >
        <h1>docusaurus-plugin-banner</h1>
        <p>
          This is an example site demonstrating the banner plugin. The blue banner at the top of the
          page is rendered by the plugin and can be dismissed.
        </p>
        <Link className="button button--primary button--lg" to="/docs/intro">
          Read the docs
        </Link>
      </main>
    </Layout>
  )
}
