import React, { useState, useEffect } from 'react';
import AdminHeader from '../../../../admin-header/admin-header';
import { BASE_URL } from '../../../../../../helper/helper';
import './manageExpense.css';

const ManageExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filterType, setFilterType] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch expenses data from the API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/bilvani/admin/getall/expense`, {
          method: 'GET',
          credentials: 'include', // Ensure the token is sent with the request
        });
        const data = await response.json();

        if (response.ok) {
          setExpenses(data.expenses);
          setFilteredExpenses(data.expenses);
        } else {
          setErrorMessage('No expenses found.');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setErrorMessage('Failed to fetch expenses. Please try again.');
      }
    };

    fetchExpenses();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterExpenses(value, filterType);
  };

  const handleFilterTypeChange = (e) => {
    const value = e.target.value;
    setFilterType(value);
    filterExpenses(searchTerm, value);
  };

  const filterExpenses = (searchValue, typeFilter) => {
    const filtered = expenses.filter((expense) => {
      const matchesSearch =
        expense.expenseType?.toLowerCase().includes(searchValue) ||
        expense.paidBy?.toLowerCase().includes(searchValue);
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter !== 'all' && expense.expenseType === typeFilter);
      return matchesSearch && matchesType;
    });
    setFilteredExpenses(filtered);
  };

  return (
    <div className="manageexpense-m putHeader">
      <AdminHeader />
      <div className="container">
        <h2 className="manage-title-m">Manage Expenses</h2>

        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by Expense Type or Paid By"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar-m"
          />

         
        </div>

        {errorMessage && <p className="error-m">{errorMessage}</p>}

        <div className="expense-table-m">
          {filteredExpenses.length > 0 ? (
            <table className="expense-table-content-m">
              <thead className="table-header-m">
                <tr className="table-row-m">
                  <th>Date</th>
                  <th>Expense Type</th>
                  <th>Payment Mode</th>
                  <th>Paid By</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="expense-row-m">
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.expenseType}</td>
                    <td>{expense.paymentMode}</td>
                    <td>{expense.paidBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-expenses-m">No expenses available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageExpense;
