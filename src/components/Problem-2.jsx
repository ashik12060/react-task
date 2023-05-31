import React, { useState, useEffect } from 'react';

const Problem2 = () => {

    //state declaration
  const [modalAVisible, setModalAVisible] = useState(false);
  const [modalBVisible, setModalBVisible] = useState(false);
  const [modalCVisible, setModalCVisible] = useState(false);
  const [onlyEvenChecked, setOnlyEvenChecked] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);




  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://contact.mediusware.com/api/contacts');
      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data);
      console.log(data);
    } catch (error) {
      console.log('Fetching Error:', error);
    }
  };

 

  const handleSearch = () => {
    // Filter contacts based on the search term
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  };


  
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleSearchDebounced = debounce(handleSearch, 300);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearchDebounced();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAllContactsClick = () => {
    setModalAVisible(true);
    setModalBVisible(false);
    setModalCVisible(false);
    setCurrentPage(1);
    setSelectedContact(null);
    window.history.pushState(null, '', '/all-contacts');
  };

  const handleUSContactsClick = () => {
    setModalAVisible(false);
    setModalBVisible(true);
    setModalCVisible(false);
    setCurrentPage(1);
    setSelectedContact(null);
    window.history.pushState(null, '', '/us-contacts');
  };



  const handleModalButtonAClick = () => {
    setModalAVisible(true);
    setModalBVisible(false);
    setModalCVisible(false);
    setSelectedContact(null);
  };

  const handleModalButtonBClick = () => {
    setModalAVisible(false);
    setModalBVisible(true);
    setModalCVisible(false);
    setSelectedContact(null);
  };

  const handleModalButtonCClick = () => {
    setModalAVisible(false);
    setModalBVisible(false);
    setModalCVisible(false);
    setSelectedContact(null);
  };

  const handleContactItemClick = (contact) => {
    setSelectedContact(contact);
    setModalCVisible(true);
  };

  const handleModalCClose = () => {
    setModalCVisible(false);
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    // Fetch more contacts when the current page changes
    if (modalAVisible || modalBVisible) {
      fetchMoreContacts();
    }
  }, [currentPage]);

  useEffect(() => {
    // Filter contacts based on the even ID checkbox
    if (onlyEvenChecked) {
      const filtered = contacts.filter((contact) => contact.id % 2 === 0);
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [onlyEvenChecked]);

  const fetchMoreContacts = async () => {
    try {
      const response = await fetch(
        `https://contact.mediusware.com/api/contacts?page=${currentPage}`
      );
      const data = await response.json();
      setContacts((prevContacts) => [...prevContacts, ...data]);
    } catch (error) {
      console.log('Error fetching more contacts:', error);
    }
  };


  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={handleAllContactsClick}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={handleUSContactsClick}
          >
            US Contacts
          </button>
        </div>

        {modalAVisible && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modal A</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleModalButtonCClick}
                  ></button>
                </div> 
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <ul className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }} onScroll={handleScroll}>
                    {filteredContacts.map((contact) => (
                      <li
                        className="list-group-item"
                        key={contact.id}
                        onClick={() => handleContactItemClick(contact)}
                      >
                        {contact.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="modal-footer">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="onlyEvenCheckbox"
                      checked={onlyEvenChecked}
                      onChange={(e) => setOnlyEvenChecked(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="onlyEvenCheckbox">
                      Only even
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModalButtonAClick}
                    style={{ backgroundColor: '#46139f' }}
                  >
                    All Contacts
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleModalButtonBClick}
                    style={{ backgroundColor: '#ff7f50' }}
                  >
                    US Contacts
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalButtonCClick}
                    style={{ backgroundColor: '#46139f', color: '#fff' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalBVisible && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modal B</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleModalButtonCClick}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <ul className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }} onScroll={handleScroll}>
                    {filteredContacts.map((contact) => (
                      <li
                        className="list-group-item"
                        key={contact.id}
                        onClick={() => handleContactItemClick(contact)}
                      >
                        {contact.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="modal-footer">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="onlyEvenCheckbox"
                      checked={onlyEvenChecked}
                      onChange={(e) => setOnlyEvenChecked(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="onlyEvenCheckbox">
                      Only even
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModalButtonAClick}
                    style={{ backgroundColor: '#46139f' }}
                  >
                    All Contacts
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleModalButtonBClick}
                    style={{ backgroundColor: '#ff7f50' }}
                  >
                    US Contacts
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalButtonCClick}
                    style={{ backgroundColor: '#46139f', color: '#fff' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalCVisible && selectedContact && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Modal C</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleModalCClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Contact Details</h6>
                  <p>Name: {selectedContact.name}</p>
                  <p>Email: {selectedContact.email}</p>
                  <p>Phone: {selectedContact.phone}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalCClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problem2;
