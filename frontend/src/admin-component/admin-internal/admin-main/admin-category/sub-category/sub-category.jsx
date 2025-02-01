import { useState, useEffect,useRef } from "react";
import Header from "../../../admin-header/admin-header";
import axios from "axios";
import "./sub-category.css";
import { BASE_URL } from "../../../../../helper/helper";

const SubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [deletedSubcategories, setDeletedSubcategories] = useState([]);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const subcategoriesPerPage = 3;

  const [currentTrashPage, setCurrentTrashPage] = useState(1);
  const trashPerPage = 3;

  const successAudioRef = useRef(null);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/bilvani/get/category`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }

    axios
      .get(`${BASE_URL}/api/bilvani/get/${selectedCategory}/subcategories`)
      .then((response) => {
        setSubcategories(response.data);
      })
      .catch((error) => console.error("Error fetching subcategories:", error));

    axios
      .get(`${BASE_URL}/api/bilvani/get/${selectedCategory}/delete-subcategory`)
      .then((response) => {
        setDeletedSubcategories(response.data);
      })
      .catch((error) =>
        console.error("Error fetching deleted subcategories:", error)
      );
  }, [selectedCategory]);

  const handleAddSubcategory = async () => {
    if (!selectedCategory) {
      displayError("Select the category first, then add the subcategory");
      return;
    }

    if (!newSubcategory.trim()) {
      displayError("Subcategory can't be empty");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/categories/${selectedCategory}/subcategories`,
        {
          subcategory: newSubcategory,
        }
      );

      if (response.status === 200) {
        displaySuccess("Subcategory added successfully");
        setSelectedCategory("");
        setNewSubcategory("");
      } else {
        throw new Error("Failed to add subcategory");
      }
    } catch (error) {
      // Check for global uniqueness error from the backend
      if (error.response && error.response.status === 400) {
        if (
          error.response.data ===
          "Subcategory with this name already exists globally"
        ) {
          displayError("Subcategory with this name already exists ");
        } else {
          displayError("An error occurred while adding the subcategory");
        }
      } else {
        setError("Failed to add subcategory");
      }
    }
  };
  const displayError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const displaySuccess = (successMessage) => {
    setSuccess(successMessage);
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  const handleTrashSubcategory = async (selectedCategory, subcategoryId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/categories/${selectedCategory}/subcategories/${subcategoryId}`
      );
      if (response.status === 200) {
        displaySuccess("Subcategory deleted successfully");
        const updatedSubcategories = subcategories.filter(
          (subcategory) => subcategory._id !== subcategoryId
        );
        setSubcategories(updatedSubcategories);

        const deletedSubcategory = subcategories.find(
          (subcategory) => subcategory._id === subcategoryId
        );
        if (deletedSubcategory) {
          setDeletedSubcategories([
            ...deletedSubcategories,
            deletedSubcategory,
          ]);
        }

        if (currentPage > 1) {
          setCurrentPage(1);
        }
      } else {
        throw new Error("Failed to delete subcategory");
      }
    } catch (error) {
      setError("Failed to delete subcategory");
    }
  };

  const handleRestoreSubcategory = async (categoryId, subcategoryId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/categories/${categoryId}/subcategories/${subcategoryId}/restore`
      );
      if (response.status === 200) {
        displaySuccess("Subcategory restored successfully");

        const updatedDeletedSubcategories = deletedSubcategories.filter(
          (subcategory) => subcategory._id !== subcategoryId
        );
        setDeletedSubcategories(updatedDeletedSubcategories);

        const restoredSubcategory = deletedSubcategories.find(
          (subcategory) => subcategory._id === subcategoryId
        );

        if (restoredSubcategory) {
          setSubcategories((prevSubcategories) => [
            ...prevSubcategories,
            restoredSubcategory,
          ]);
        }

        setCurrentPage(1);
        setCurrentTrashPage(1);
      } else {
        throw new Error("Failed to restore subcategory");
      }
    } catch (error) {
      setError("Failed to restore subcategory");
    }
  };

  const handleEditClick = (subcategoryId, subcategoryName) => {
    setEditingSubcategoryId(subcategoryId);
    setNewSubcategory(subcategoryName);
  };

  // Update subcategory
  const handleEditSubmit = async (
    categoryId,
    subcategoryId,
    newSubcategoryName
  ) => {
    if (!newSubcategoryName.trim()) {
      displayError("Subcategory name cannot be empty");
      return;
    }

    const isDuplicate = subcategories.some(
      (subcategory) =>
        subcategory.name.toLowerCase() === newSubcategoryName.toLowerCase() &&
        subcategory._id !== subcategoryId
    );

    if (isDuplicate) {
      displayError("Subcategory name must be unique within the category");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/categories/${categoryId}/subcategories/${subcategoryId}`,
        {
          subcategory: newSubcategoryName,
        }
      );

      if (response.status === 200) {
        displaySuccess("Subcategory updated successfully");
        const updatedSubcategories = subcategories.map((subcategory) => {
          if (subcategory._id === subcategoryId) {
            return { ...subcategory, name: newSubcategoryName };
          }
          return subcategory;
        });
        setSubcategories(updatedSubcategories);
        setEditingSubcategoryId("");
        setNewSubcategory("");
      } else {
        throw new Error("Failed to update subcategory");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data ===
          "Subcategory name must be unique within the category"
      ) {
        displayError("Subcategory name must be unique within the category");
      } else {
        setError("Failed to update subcategory");
      }
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/categories/delete/${categoryId}/subcategory/${subcategoryId}`
      );

      if (response.status === 200) {
        displaySuccess("Subcategory deleted completely");

        // Update the state to remove the deleted subcategory
        const updatedDeletedSubcategories = deletedSubcategories.filter(
          (subcategory) => subcategory._id !== subcategoryId
        );
        setDeletedSubcategories(updatedDeletedSubcategories);
      } else {
        throw new Error("Failed to delete subcategory completely");
      }
    } catch (error) {
      setError("Failed to delete subcategory completely");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(subcategories.length / subcategoriesPerPage);
  const indexOfLastSubcategory = currentPage * subcategoriesPerPage;
  const indexOfFirstSubcategory = indexOfLastSubcategory - subcategoriesPerPage;
  const currentSubcategories = subcategories.slice(
    indexOfFirstSubcategory,
    indexOfLastSubcategory
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate total pages for deleted subcategories
  const totalTrashPages = Math.ceil(deletedSubcategories.length / trashPerPage);
  const indexOfLastTrash = currentTrashPage * trashPerPage;
  const indexOfFirstTrash = indexOfLastTrash - trashPerPage;
  const currentDeletedSubcategories = deletedSubcategories.slice(
    indexOfFirstTrash,
    indexOfLastTrash
  );

  // Handle pagination for Trash
  const handleNextTrashPage = () => {
    if (currentTrashPage < totalTrashPages) {
      setCurrentTrashPage(currentTrashPage + 1);
    }
  };

  const handlePreviousTrashPage = () => {
    if (currentTrashPage > 1) {
      setCurrentTrashPage(currentTrashPage - 1);
    }
  };

  useEffect(() => {
    if (success) {
      // Play success sound
      if (successAudioRef.current) {
        successAudioRef.current.play();
      }
      
      const timer = setTimeout(() => {
        setSuccess(""); 
      }, 1000);

      return () => {
        clearTimeout(timer);
        
        if (successAudioRef.current) {
          successAudioRef.current.pause();
          successAudioRef.current.currentTime = 0; 
        }
      };
    }
  }, [success]);

  return (
    <div className="putHeader">
      <Header />
      <div className="container">
        {success && <p className="toast toast-success">{success}</p>}
        {error && <p className="toast toast-error">{error}</p>}
        <audio ref={successAudioRef} src="/success-sound.mp3" />
        <div className="add-category-form">
          <h3>Sub Category</h3>

          <div className="inputSelect">
            <label htmlFor="categorySelect">Select Category :</label>
            <select
              id="categorySelect"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" className="selectOption">
                Select a category
              </option>
              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                  className="selectOption"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="subInputForm">
            <label htmlFor="subcategoryInput">Name of Subcategory : </label>
            <input
              type="text"
              id="subcategoryInput"
              value={newSubcategory}
              placeholder="Enter Sub Category Here...."
              onChange={(e) => setNewSubcategory(e.target.value)}
            />
          </div>
          <button onClick={handleAddSubcategory} className="adminbtn">
            Submit
          </button>
        </div>

        <div className="allCategory">
          <h3>All Subcategories</h3>

          <div className="subcategory-table">
            {currentSubcategories.length === 0 ? (
              selectedCategory ? (
                <p>Please Enter Subcategory</p>
              ) : (
                <p>Select Category to View</p>
              )
            ) : (
              <>
                <p>Total Subcategories: {subcategories.length}</p>
                <table className="table table-striped category-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubcategories.map((subcategory) => (
                      <tr key={subcategory._id}>
                        <td>
                          {editingSubcategoryId === subcategory._id ? (
                            <input
                              type="text"
                              value={newSubcategory}
                              onChange={(e) =>
                                setNewSubcategory(e.target.value)
                              }
                            />
                          ) : (
                            subcategory.name
                          )}
                        </td>

                        <td>
                          {editingSubcategoryId === subcategory._id ? (
                            <div className="saveBtnCancelMobile">
                              <button
                                onClick={() =>
                                  handleEditSubmit(
                                    selectedCategory,
                                    subcategory._id,
                                    newSubcategory
                                  )
                                }
                                className="submit-btn"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSubcategoryId("");
                                  setNewSubcategory("");
                                }}
                                className="submit-btn ms-2"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="saveBtnCancelMobile">
                              <button
                                onClick={() =>
                                  handleEditClick(
                                    subcategory._id,
                                    subcategory.name
                                  )
                                }
                                className="submit-btn"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleTrashSubcategory(
                                    selectedCategory,
                                    subcategory._id
                                  )
                                }
                                className="submit-btn ms-3"
                              >
                                Trash
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {selectedCategory && deletedSubcategories.length > 0 && (
          <div className="allCategory">
            <h3>Trash</h3>
            <div className="subcategory-table">
              <p>Total Subcategories in Trash: {deletedSubcategories.length}</p>
              <table className="table table-striped category-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentDeletedSubcategories.map((deletedSubcategory) => (
                    <tr key={deletedSubcategory._id}>
                      <td>{deletedSubcategory.name}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleRestoreSubcategory(
                              selectedCategory,
                              deletedSubcategory._id
                            )
                          }
                          className="submit-btn"
                        >
                          Restore
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteSubcategory(
                              selectedCategory,
                              deletedSubcategory._id
                            )
                          }
                          className="submit-btn ms-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls for Trash */}
            {totalTrashPages > 1 && (
              <div className="pagination">
                <button
                  onClick={handlePreviousTrashPage}
                  disabled={currentTrashPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentTrashPage} of {totalTrashPages}
                </span>
                <button
                  onClick={handleNextTrashPage}
                  disabled={currentTrashPage === totalTrashPages}
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

export default SubCategory;
