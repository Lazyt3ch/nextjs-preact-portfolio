import '../styles/globals.css';
import Navbar from "../components/navbar";
import Container from "../components/container";

export default function MyApp({ Component, pageProps }) {  
  return (
    <>
      <Navbar />
      <Container>
        <Component { ...pageProps } />
      </Container>
    </>
  );
}


