import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RecipeDetail() {
  const { id } = useParams(); // Extracts the ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        // Fetching specific details for one recipe
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipeDetail();
  }, [id, API_KEY]);

  if (error) return <div className="error-message">Error fetching details: {error}</div>;
  if (!recipe) return <div>Loading recipe details...</div>;

  return (
    <div className="recipe-detail-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className="detail-image" />
      
      <div className="detail-stats">
        <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Health Score:</strong> {recipe.healthScore}</p>
        <p><strong>Diet:</strong> {recipe.vegan ? "Vegan" : recipe.vegetarian ? "Vegetarian" : "Standard"}</p>
      </div>

      <div className="detail-section">
        <h3>Summary</h3>
        {/* The API returns HTML for the summary, so we use dangerouslySetInnerHTML */}
        <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
      </div>
    </div>
  );
}