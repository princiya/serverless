import React, { useState } from 'react'
import './App.css'

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [response, setResponse] = useState();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title === '' && description === '') {
      return;
    }

    const res = await fetch('/.netlify/functions/promotion', {
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
