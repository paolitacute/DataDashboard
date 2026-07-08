import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dietFilter, setDietFilter] = useState("")
  const [error, setError] = useState(null)

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=15`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setRecipes(data.results)
        setFilteredRecipes(data.results)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchRecipes()
  }, [])

  useEffect(() => {
    let result = recipes

    if (searchQuery) {
      result = result.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (dietFilter) {
      if (dietFilter === "vegan") {
        result = result.filter(recipe => recipe.vegan)
      } else if (dietFilter === "vegetarian") {
        result = result.filter(recipe => recipe.vegetarian)
      } else if (dietFilter === "glutenFree") {
        result = result.filter(recipe => recipe.glutenFree)
      }
    }

    setFilteredRecipes(result)
  }, [searchQuery, dietFilter, recipes])

  if (error) {
    return <div className="error-message">Error fetching data: {error}</div>
  }

  const totalRecipes = filteredRecipes ? filteredRecipes.length : 0
  
  const avgTime = filteredRecipes && filteredRecipes.length > 0 
    ? Math.round(filteredRecipes.reduce((acc, recipe) => acc + recipe.readyInMinutes, 0) / filteredRecipes.length) 
    : 0
    
  const totalVegan = filteredRecipes ? filteredRecipes.filter(recipe => recipe.vegan).length : 0

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Recipe Dashboard</h1>
      </div>
      
      <div className="summary-statistics">
        <div className="stat-card">
          <h3>Total Recipes</h3>
          <p>{totalRecipes}</p>
        </div>
        <div className="stat-card">
          <h3>Average Ready Time</h3>
          <p>{avgTime} min</p>
        </div>
        <div className="stat-card">
          <h3>Vegan Options</h3>
          <p>{totalVegan}</p>
        </div>
      </div>

      <div className="filters">
        <input 
          type="text" 
          placeholder="Search recipes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select 
          value={dietFilter} 
          onChange={(e) => setDietFilter(e.target.value)}
        >
          <option value="">All Diets</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="glutenFree">Gluten Free</option>
        </select>
      </div>

      <div className="recipe-list">
        {filteredRecipes && filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <div className="recipe-details">
                <h3>{recipe.title}</h3>
                <p>⏱️ {recipe.readyInMinutes} Minutes</p>
                <p>🥗 {recipe.vegan ? "Vegan" : recipe.vegetarian ? "Vegetarian" : "Standard Diet"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}

export default App