import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [response, setResponse] = useState();
  const [articles, setArticles] = useState<any>(null);

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
      body: JSON.stringify({ title, description, link }),
    }).then((res) => res.json());

    setResponse(res);
    setTitle('');
    setDescription('');
    setLink('');
  }

  return (
    <div className="App">
      <header className="App-header">
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </header>
      <main>
        <div>
          {articles?.map((article:any) => 
            <div key={article.id}>
              <span>{`Title: ${article.title} `}</span>
              <span>{`Description: ${article.description} `}</span>
              <span>{`Url: ${article.url}`}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input type="text" onChange={e => setTitle(e.target.value)} value={title}/>
          
          <label>Description</label>
          <input type="text" onChange={e => setDescription(e.target.value)} value={description}/>
          
          <label>Link</label>
          <input type="text" onChange={e => setLink(e.target.value)} value={link}/>
          
          <button>Submit</button>
        </form>  
      </main>
    </div>
  )
}

export default App
