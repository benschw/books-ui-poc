import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class BookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: ''
    };

    this.handleLibraryUpdate = () => props.handleLibraryUpdate();

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTitleChange(event) {
    this.setState({title: event.target.value});
  }
  handleAuthorChange(event) {
      this.setState({author: event.target.value});
  }

  handleSubmit(event) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: this.state.title,
        author: this.state.author
      })
    };
    fetch('/book', requestOptions)
        .then(response => response.json())
        .then(data => {
          this.handleLibraryUpdate();
        });

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title:
          <input type="text" value={this.state.title} onChange={this.handleTitleChange} />
        </label>
        <label>
          Author:
          <input type="text" value={this.state.author} onChange={this.handleAuthorChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


class Books extends React.Component {
  render() {
    const { books } = this.props;
    return (
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} - {book.author}
          </li>
        ))}
      </ul>
    );
  }
}

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      books: []
    };

    this.refresh = this.refresh.bind(this);

  }
  componentDidMount() {
    this.refresh()
  }
  refresh() {
    fetch("/book")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            books: result.data
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {

      return (
        <div>
          <Books books={this.state.books} />
          <BookForm handleLibraryUpdate={this.refresh}/>
        </div>
      );
    }
  }
}

// ========================================

ReactDOM.render(
  <Library />,
  document.getElementById('root')
);
