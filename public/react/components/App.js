import React, { useState, useEffect } from 'react'
import { PagesList } from './PagesList'

// import and prepend the api url to any fetch calls
import apiURL from '../api'

export const App = () => {
  const [pages, setPages] = useState([])
  const [selectedArticle, setSelectedArticle]=useState(null)
  async function fetchPages () {
    try {
      const response = await fetch(`${apiURL}/wiki`)
      
      const pagesData = await response.json()
    
      setPages(pagesData)
    } catch (err) {
      console.log('Oh no an error! ', err)
    }
  }

  async function fetchArticle(slug) {
    try {
      const response = await fetch(`http://localhost:3000/api/wiki/${slug}`);
      const articleData = await response.json();
      console.log(`${slug}`)
      setSelectedArticle(articleData);
    } catch (err) {
      console.log('Error fetching article:', err);
    }
  }

  function handleBackToList() {
    setSelectedArticle(null);
  }

  useEffect(() => {
    fetchPages()
  }, [])

  return (
		<main>
      <h1>WikiVerse</h1>
			<h2>An interesting 📚</h2>
			{selectedArticle ? (
      <div>
        <h3>{selectedArticle.title}</h3>
       
        <p><strong>Author:</strong> {selectedArticle.author.name}</p>
        <p><strong>Content:</strong> {selectedArticle.content}</p>
        <p><strong>Tags:</strong> {selectedArticle.tags.map(tag => tag.name).join(', ')}</p>
        <p><strong>Date:</strong> {new Date(selectedArticle.createdAt).toLocaleDateString()}</p>
        <button onClick={handleBackToList}>Back to Wiki List</button>
      </div>
    ) : (
      
      <PagesList pages={pages} onArticleClick={fetchArticle} />
    )}
		</main>
  )
}
