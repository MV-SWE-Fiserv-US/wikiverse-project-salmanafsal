import React, { useState, useEffect } from 'react'
import { PagesList } from './PagesList'

// import and prepend the api url to any fetch calls
import apiURL from '../api'



export const App = () => {
  const [pages, setPages] = useState([])
  const [selectedArticle, setSelectedArticle]=useState(null)
  const [isAddingArticle, setIsAddingArticle]=useState(null)


  useEffect(() => {
    fetchPages()
  }, [])

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    name: "",
    email: "",
    tags: "",
  });


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
      
      setSelectedArticle(articleData);
    } catch (err) {
      console.log('Error fetching article:', err);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }; 


  function handleBackToList() {
    setSelectedArticle(null);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { title, content, name, email, tags } = formData;
    const requestBody = {
      title,
      content,
      name, 
      email,
      tags,
    };
    try {
      const response = await fetch(`http://localhost:3000/api/wiki`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const newPage = await response.json();
        setPages((prevPages) => [...prevPages, newPage]);
        setIsAddingArticle(false); // Return to the list view
        setFormData({ title: "", content: "", name: "", email: "", tags: "" }); // Reset form
      } else {
        console.error("Failed to add article.");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  async function DeleteArticle(slug) {
    
    try {
        const response = await fetch(`http://localhost:3000/api/wiki/${slug}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            return; // Exit early if JSON parsing fails
        }

        console.log("Article deleted successfully:", data);

        // Call handleBackToList or update UI as needed
         //handleBackToList();
         if(selectedArticle != null)
         {
         setSelectedArticle(null)
         fetchPages()
         }

    } catch (err) {
        console.log("Error deleting article:", err);
    }
}


 

  return (
		<main>
      <h1>WikiVerse</h1>
			<h2>An interesting 📚</h2>
			{isAddingArticle ? (
        <form onSubmit={handleFormSubmit}>
          <h3>Create a New Article</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Author Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Author Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (space-separated)"
            value={formData.tags}
            onChange={handleInputChange}
          />
          <button type="submit">Add Article</button>
          <button type="button" onClick={() => setIsAddingArticle(false)}>
            Cancel
          </button>
        </form>
      ) : selectedArticle ? (
        <div>
          <h3>{selectedArticle.title}</h3>
          <p>
            <strong>Author:</strong> {selectedArticle.author.name}
          </p>
          <p>
            <strong>Content:</strong> {selectedArticle.content}
          </p>
          <p>
            <strong>Tags:</strong> {selectedArticle.tags
              .map((tag) => tag.name)
              .join(", ")}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedArticle.createdAt).toLocaleDateString()}
          </p>
          <button onClick={() => DeleteArticle(selectedArticle.slug)}>Delete Page</button>
          <button onClick={handleBackToList}>Back to Wiki List</button>
          
        </div>
      ) : (
        <>
          <PagesList pages={pages} onArticleClick={fetchArticle} />
          <button onClick={() => setIsAddingArticle(true)}>
            Create New Article
          </button>
        </>
      )}
    </main>
  );
};
      
     