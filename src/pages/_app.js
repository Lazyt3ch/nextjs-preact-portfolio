import '../styles/globals.css';
import Navbar from "../components/navbar";
import Container from "../components/container";

function MyApp({ Component, pageProps }) {  
  return (
    <>
      <Navbar />
      <Container>
        <Component { ...pageProps } />
      </Container>
    </>
  );
}

export default MyApp
