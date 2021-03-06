import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./style.css";

const SearchBar = ({ search, handleInputChange, clearSearch }) => {

  return (

    <Form className="searchBar" onSubmit={e => {
      e.preventDefault();
      e.stopPropagation();
    }
    }>
      <Form.Group>
        <Form.Label><h5 className="searchBarH1">Search</h5></Form.Label>
        <Form.Control
          id="searchInput"
          type="text"
          placeholder="Search something..."
          onChange={e => handleInputChange(e.target.value)}
          name="search"
          autoComplete="off"
        />
      </Form.Group>
      {search.length > 0 && (
        <Button
          className="btn"
          size="lg"
          type="click"
          variant="dark"
          onClick={clearSearch}
        >
          Clear Search
        </Button>
      )}
    </Form>

  )

}

export default SearchBar