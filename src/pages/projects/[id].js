import Head from 'next/head'
import styles from '../../styles/Project.module.css';

import { useRouter } from 'next/router';
const { JSDOM } = require('jsdom');

// https://freelance.habr.com/freelancers/Lazytech/projects
const baseUrl = "https://freelance.habr.com";

export default function Project(props) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      Post: {id}
    </div>
  );


}


