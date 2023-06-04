import sys

import pandas as pd

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python main.py <Books_CSV_Path> <Users_CSV_Path> <Ratings_CSV_Path> [additional_args...]")
        sys.exit(1)
    books_csv_path = sys.argv[1]
    users_csv_path = sys.argv[2]
    ratings_csv_path = sys.argv[3]
    additional_args = sys.argv[4:]
    books_data = pd.read_csv(sys.argv[1])
    ratings_data = pd.read_csv(sys.argv[3])
    isbn_counts = ratings_data['ISBN'].value_counts()
    top_100_isbn = isbn_counts.head(100).index

    # Filter books_data based on the top 50 ISBN values and retrieve the "Book-Title" and "Image-URL-M" columns
    filtered_books_data = books_data.loc[
        books_data['ISBN'].isin(top_100_isbn), ['ISBN', 'Book-Title', 'Book-Author', 'Image-URL-M']]

    # Create an empty array to store book and image pairs
    book_image_array = []

    # Iterate over the filtered_books_data and add each book with its image URL to the array
    for index, row in filtered_books_data.iterrows():
        book_ISBN = row['ISBN']
        book_name = row['Book-Title']
        book_author = row['Book-Author']
        image_url = row['Image-URL-M']
        print([book_ISBN, book_name, book_author, image_url])