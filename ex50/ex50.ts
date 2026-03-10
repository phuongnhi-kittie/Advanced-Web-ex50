import { Component, OnInit } from '@angular/core';
import { Book50Service } from '../books';

@Component({
  selector: 'app-books',
  standalone: false,
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books50Component implements OnInit {
  books: any[] = [];
  currentBook: any = {
    title: '',
    author: '',
    price: 0,
    description: '',
    image: ''
  };
  selectedFile: File | null = null;
  isEditing: boolean = false;
  message: string = '';
  isError: boolean = false;

  constructor(private bookService: Book50Service) {}

  ngOnInit() {
    console.log('Books50Component initialized');
    this.loadBooks();
  }

  loadBooks() {
    console.log('Calling getBooks service...');
    this.bookService.getBooks().subscribe({
      next: (data) => {
        console.log('Data received from API:', data);
        console.log('Data type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        console.log('Data length:', data?.length);
        this.books = data || [];
        console.log('Books array after assignment:', this.books);
        console.log('Books length:', this.books.length);
        // this.showMessage('Books loaded successfully', false);
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.showMessage('Error loading books: ' + err.message, true);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.isEditing) {
      this.updateBook();
    } else {
      this.addBook();
    }
  }

  addBook() {
    const formData = new FormData();
    formData.append('title', this.currentBook.title);
    formData.append('author', this.currentBook.author);
    formData.append('price', this.currentBook.price.toString());
    formData.append('description', this.currentBook.description);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.bookService.createBook(formData).subscribe({
      next: (data) => {
        this.books.push(data);
        this.showMessage('Book added successfully!', false);
        this.resetForm();
      },
      error: (err) => {
        this.showMessage('Error adding book: ' + err.message, true);
      }
    });
  }

  updateBook() {
    const formData = new FormData();
    formData.append('title', this.currentBook.title);
    formData.append('author', this.currentBook.author);
    formData.append('price', this.currentBook.price.toString());
    formData.append('description', this.currentBook.description);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.bookService.updateBook(this.currentBook.id, formData).subscribe({
      next: (data) => {
        const index = this.books.findIndex(b => b.id === this.currentBook.id);
        if (index !== -1) {
          this.books[index] = data;
        }
        this.showMessage('Book updated successfully!', false);
        this.resetForm();
      },
      error: (err) => {
        this.showMessage('Error updating book: ' + err.message, true);
      }
    });
  }

  editBook(book: any) {
    this.currentBook = { ...book };
    this.isEditing = true;
    this.selectedFile = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteBook(id: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(b => b.id !== id);
          this.showMessage('Book deleted successfully!', false);
        },
        error: (err) => {
          this.showMessage('Error deleting book: ' + err.message, true);
        }
      });
    }
  }

  resetForm() {
    this.currentBook = {
      title: '',
      author: '',
      price: 0,
      description: '',
      image: ''
    };
    this.selectedFile = null;
    this.isEditing = false;
  }

  showMessage(msg: string, isError: boolean) {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/no-image.png';
  }
}
