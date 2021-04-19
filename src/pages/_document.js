import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html
        lang="ru"
      >
        <Head>
          <meta name="description" content="Образцы работ веб-разработчика Lazytech" />
          <meta name="keywords" content="Lazytech, веб-разработчик, веб-разработка, Next, NextJS, Next.js, React, ReactJS, React.js, HTML, HTML5, CSS, CSS3, JavaScript, ECMAScript, ES6, ES2015" />
          <meta name="author" content="Lazytech" />          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
