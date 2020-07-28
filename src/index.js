import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import { Input } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';




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
      <form noValidate autoComplete="off" >
        <Input placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />
        <Input placeholder="Author" value={this.state.author} onChange={this.handleAuthorChange} />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button variant="outlined" color="primary" value="Submit" onClick={this.handleSubmit}>Add</Button>
      </form>
    );
  }
}


class Books extends React.Component {
  render() {
    const { books } = this.props;
    return (
      <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map(book => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
            </TableRow>
          
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
          <br />
          <BookForm handleLibraryUpdate={this.refresh}/>
        </div>
      );
    }
  }
}

// ========================================

ReactDOM.render(
  <Container maxWidth="sm">
    <Card>
      <CardContent>
        <Library />
      </CardContent>
    </Card>
  </Container>,
  document.getElementById('root')
);
