import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ChefHat, Search, LogOut, User as UserIcon } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

// Auth Context
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthPage authView={authView} setAuthView={setAuthView} setIsAuthenticated={setIsAuthenticated} />;
  }

  return <RecipeOrganizer onLogout={handleLogout} />;
}

// Auth Page Component
function AuthPage({ authView, setAuthView, setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = authView === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = authView === 'login'
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(typeof data === 'string' ? data : 'Authentication failed');
        setLoading(false);
        return;
      }

      if (authView === 'login') {
        // Only login stores token and authenticates
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setLoading(false);  
      } else {
        // Register should NOT auto-login
        alert('Registration successful! Please login.');
        setAuthView('login');
        setLoading(false);  
      }

    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl inline-block mb-4">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Recipe Organizer</h1>
          <p className="text-orange-50">Manage your favorite recipes</p>
        </div>

        <div className="p-8">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => {
                setAuthView('login');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${authView === 'login'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthView('register');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${authView === 'register'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {authView === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : authView === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Recipe Organizer Component
function RecipeOrganizer({ onLogout }) {
  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const data = await response.json();
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a recipe title');
      return;
    }
    if (!formData.ingredients.trim()) {
      alert('Please enter at least one ingredient');
      return;
    }
    if (!formData.instructions.trim()) {
      alert('Please enter cooking instructions');
      return;
    }

    const recipeData = {
      title: formData.title,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim() !== ''),
      instructions: formData.instructions
    };

    try {
      if (isEditing) {
        const response = await fetch(`${API_BASE_URL}/api/recipes/${currentRecipe.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
          alert('Failed to update recipe');
          return;
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/api/recipes`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
          alert('Failed to add recipe');
          return;
        }
      }

      fetchRecipes();
      closeModal();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        fetchRecipes();
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentRecipe(null);
    setFormData({ title: '', ingredients: '', instructions: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (recipe) => {
    setIsEditing(true);
    setCurrentRecipe(recipe);
    setFormData({
      title: recipe.title,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', ingredients: '', instructions: '' });
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-3 rounded-xl shadow-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recipe Organizer</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your favorite recipes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={openAddModal}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Recipe</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
            <p className="text-gray-500">Start by adding your first recipe!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-orange-400 to-amber-400 h-2"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {recipe.title}
                  </h3>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                      Ingredients
                    </h4>
                    <ul className="space-y-1 ml-4">
                      {recipe.ingredients.slice(0, 4).map((ingredient, idx) => (
                        <li key={idx} className="text-sm text-gray-600 line-clamp-1">
                          • {ingredient}
                        </li>
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <li className="text-sm text-orange-500 font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewRecipe(recipe);
                            }}
                            className="hover:text-orange-600 hover:underline cursor-pointer"
                          >
                            +{recipe.ingredients.length - 4} more (click to view all)
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                      Instructions
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {recipe.instructions}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(recipe)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* View Recipe Details Modal */}
      {viewRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-400 to-amber-400 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">
                {viewRecipe.title}
              </h2>
              <button
                onClick={() => setViewRecipe(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                  Ingredients
                </h3>
                <ul className="space-y-2 ml-5">
                  {viewRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-gray-700">
                      • {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-amber-400 rounded-full mr-2"></span>
                  Instructions
                </h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {viewRecipe.instructions}
                </p>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setViewRecipe(null);
                    openEditModal(viewRecipe);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Edit Recipe</span>
                </button>
                <button
                  onClick={() => setViewRecipe(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipe Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Chocolate Chip Cookies"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ingredients (one per line)
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="2 cups flour&#10;1 cup sugar&#10;2 eggs"
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Describe how to make this recipe..."
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg font-semibold"
                >
                  {isEditing ? 'Update Recipe' : 'Add Recipe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;