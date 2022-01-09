import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [link, setLink] = useState('');
  const [response, setResponse] = useState();
  const [articles, setArticles] = useState<any>(null);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/.netlify/functions/article-read');
      const data = await response.json();
    
      setArticles(data);
    };

    fetchData();
    
  }, []);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title === '' && description === '') {
      return;
    }

    const res = await fetch('/.netlify/functions/article-create', {
      method: 'POST',
      body: JSON.stringify({ title, description, link, author }),
    }).then((res) => res.json());

    setResponse(res);
    setTitle('');
    setDescription('');
    setAuthor('');
    setLink('');
  }

  async function handleSubmitFilter(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (date1 === '' && date2 === '') {
      return;
    }

    const newDate1 = new Date(date1);
    const newDate2 = new Date(date2);

    // const res = await fetch(`/.netlify/functions/article-filter?date1=${date1}&date2=${date2}`)
    //   .then((res) => res.json());

    const filteredArticles = articles.filter(
      (article: any) => new Date(article.created_at) > newDate1 && new Date(article.created_at) < newDate2
    );
    
    setArticles(filteredArticles);
    setDate1('');
    setDate2('');
  }

  return (
    <div className="App">
      <header className="App-header">
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </header>
      <main>
        <div>
          {`No. of articles: ${articles?.length}`}
          {articles?.map((article:any) => 
            <div key={article.id}>
              <span>{`Title: ${article.title} `}</span>
              <span>{`Description: ${article.description} `}</span>
              <span>{`Author: ${article.author} `}</span>
              <span>{`Url: ${article.url}`}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div>CREATE</div>
          <label>Title</label>
          <input type="text" onChange={e => setTitle(e.target.value)} value={title}/>
          
          <label>Description</label>
          <input type="text" onChange={e => setDescription(e.target.value)} value={description}/>

          <label>Author</label>
          <input type="text" onChange={e => setAuthor(e.target.value)} value={author}/>
          
          <label>Link</label>
          <input type="text" onChange={e => setLink(e.target.value)} value={link}/>
          
          <button>Submit</button>
        </form>
        <form onSubmit={handleSubmitFilter}>
          <div>FILTER</div>
          <label>Date1</label>
          <input type="text" onChange={e => setDate1(e.target.value)} value={date1}/>
          
          <label>Date2</label>
          <input type="text" onChange={e => setDate2(e.target.value)} value={date2}/>

          <button>Submit</button>
        </form>  
      </main>
    </div>
  )
}

export default App
