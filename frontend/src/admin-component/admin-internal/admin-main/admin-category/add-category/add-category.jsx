import { useState, useEffect ,useRef} from "react";
import axios from "axios";
import "./add-category.css";
import Header from "../../../admin-header/admin-header";
import { BASE_URL } from "../../../../../helper/helper";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [trashCurrentPage, setTrashCurrentPage] = useState(1);

  const successAudioRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bilvani/get/category`);
      setCategories(response.data);

      const deletedResponse = await axios.get(
        `${BASE_URL}/api/bilvani/get/delete-category`
      );
      setDeletedCategories(deletedResponse.data);
    } catch (error) {
      setError("Error fetching categories");
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, trashCurrentPage]);

  // Handle category name change
  const handleChange = (event) => {
    setCategoryName(event.target.value);
  };

  // Handle category submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (categoryName.trim() === "") {
      setError("Category Name cannot be empty");
      setSuccessMessage(""); 
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/categories`, {
        name: categoryName,
        subcategories: [],
      },
      {
        withCredentials: true,
      }
    );
      fetchCategories();
      setCategoryName("");
      setSuccessMessage("Category added successfully!"); 
      setError(""); 
    } catch (error) {
      setError("Error creating category");
      setSuccessMessage(""); 
    }
  };

  // Handle trashing a category
  const handleTrash = async (categoryId) => {
    try {
      await axios.delete(`${BASE_URL}/api/categories/${categoryId}`);
      fetchCategories();
      setSuccessMessage("Category moved to Trash successfully!"); // Set success message
      setError(""); // Clear error message

      // Check if the current page has no more categories after the delete
      const remainingItems = categories.length - 1;
      const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
      if (remainingItems <= indexOfFirstItem && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      setError("Error deleting category");
      setSuccessMessage(""); // Clear success message
    }
  };

  // Handle deleting a category permanently from Trash
  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${BASE_URL}/api/categories/delete/category/${categoryId}`);
      fetchCategories();
      setSuccessMessage("Category deleted permanently!"); // Set success message
      setError(""); // Clear error message

      const remainingTrashItems = deletedCategories.length - 1;
      const trashIndexOfFirstItem = (trashCurrentPage - 1) * itemsPerPage;
      if (remainingTrashItems <= trashIndexOfFirstItem && trashCurrentPage > 1) {
        setTrashCurrentPage(trashCurrentPage - 1);
      }
    } catch (error) {
      setError("Error deleting category");
      setSuccessMessage(""); // Clear success message
    }
  };

  // Handle restoring a category from Trash
  const handleRestore = async (categoryId) => {
    try {
      await axios.put(`${BASE_URL}/api/categories/${categoryId}/restore`);
      fetchCategories();
      setSuccessMessage("Category restored successfully!"); // Set success message
      setError(""); // Clear error message
    } catch (error) {
      setError("Error restoring category");
      setSuccessMessage(""); // Clear success message
    }
  };

  // Handle editing a category
  const handleEdit = (categoryId, categoryName) => {
    setEditingCategoryId(categoryId);
    setNewCategoryName(categoryName);
  };

  // Handle submitting category edit
  const handleEditSubmit = async (categoryId) => {
    try {
      if (newCategoryName.trim() === "") {
        setError("Category Name cannot be empty");
        setSuccessMessage(""); // Clear success message
        return;
      }
      await axios.put(`${BASE_URL}/api/categories/${categoryId}`, {
        name: newCategoryName,
      });
      fetchCategories();
      setEditingCategoryId(null);
      setNewCategoryName("");
      setSuccessMessage("Category updated successfully!"); // Set success message
      setError(""); // Clear error message
    } catch (error) {
      setError("Error updating category");
      setSuccessMessage(""); // Clear success message
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setNewCategoryName("");
  };

  // Pagination logic for active categories
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination logic for Trash
  const trashTotalPages = Math.ceil(deletedCategories.length / itemsPerPage);
  const paginateTrash = (pageNumber) => setTrashCurrentPage(pageNumber);

  const trashIndexOfLastItem = trashCurrentPage * itemsPerPage;
  const trashIndexOfFirstItem = trashIndexOfLastItem - itemsPerPage;
  const currentTrashItems = deletedCategories.slice(
    trashIndexOfFirstItem,
    trashIndexOfLastItem
  );

  useEffect(() => {
    if (successMessage) {
      // Play success sound
      if (successAudioRef.current) {
        successAudioRef.current.play();
      }
      
      const timer = setTimeout(() => {
        setSuccessMessage(""); // Clear success message after timeout
      }, 1000);

      return () => {
        clearTimeout(timer);
        // Stop the sound when success message is cleared
        if (successAudioRef.current) {
          successAudioRef.current.pause();
          successAudioRef.current.currentTime = 0; // Reset sound
        }
      };
    }
  }, [successMessage]);
  return (
    <div className="putHeader">
      <Header />
      <div className="container">
      {successMessage && <p className="toast toast-success">{successMessage}</p>}
      {error && <p className="toast toast-error">{error}</p>}
    
      <audio ref={successAudioRef} src="/success-sound.mp3" />

        {/* Add Category Form */}
        <div className="mainFormadmin">
          <h3>Add Category</h3>
          <div className="inputFormadmin">
            <form className="formadmin" onSubmit={handleSubmit}>
              <label htmlFor="name">Name of Category : </label>
              <input
                type="text"
                placeholder="Enter Category Name"
                id="name"
                value={categoryName}
                onChange={handleChange}
              />
              <button className="adminbtn">Submit</button>
            </form>
          </div>
        </div>

        {/* Active Categories Section */}
        <div className="allCategory">
          <h3>All Categories</h3>
          <p>Total Categories Added: {categories.length}</p>{" "}
          {/* Display total active categories */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((category) => (
                <tr key={category._id}>
                  <td>
                    {editingCategoryId === category._id ? (
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </td>

                  <td>


                    {editingCategoryId === category._id ? (
                      <div className="saveBtnCancelMobile">
                        <button
                          onClick={() => handleEditSubmit(category._id)}
                          className="submit-btn"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="submit-btn ms-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleEdit(category._id, category.name)
                          }
                          className="submit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTrash(category._id)}
                          className="submit-btn ms-3"
                        >
                          Trash
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Trash Section */}
        {deletedCategories.length > 0 && (
          <div className="allCategory">
            <h3>Trash</h3>
            <p>Total Categories in Trash: {deletedCategories.length}</p>{" "}
            {/* Display total categories in Trash */}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {currentTrashItems.map((deletedCategory) => (
                  <tr key={deletedCategory._id}>
                    <td>{deletedCategory.name}</td>
                    <div className="saveBtnCancelMobile">

                      <button
                        onClick={() => handleRestore(deletedCategory._id)}
                        className="submit-btn"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(deletedCategory._id)}
                        className="submit-btn ms-2"
                      >
                        Delete
                      </button>
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
            {trashTotalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginateTrash(trashCurrentPage - 1)}
                  disabled={trashCurrentPage === 1}
                >
                  Previous
                </button>
                {[...Array(trashTotalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginateTrash(i + 1)}
                    className={trashCurrentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginateTrash(trashCurrentPage + 1)}
                  disabled={trashCurrentPage === trashTotalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
