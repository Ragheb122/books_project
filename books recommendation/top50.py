import pandas as pd

books_data = pd.read_csv('Books.csv')
ratings_data = pd.read_csv('Ratings.csv')
isbn_counts = ratings_data['ISBN'].value_counts()
top_50_isbn = isbn_counts.head(50).index

# Filter books_data based on the top 50 ISBN values and retrieve the "Book-Title" and "Image-URL-M" columns
filtered_books_data = books_data.loc[books_data['ISBN'].isin(top_50_isbn), ['Book-Title', 'Image-URL-M']]

# Create an empty array to store book and image pairs
book_image_array = []

# Iterate over the filtered_books_data and add each book with its image URL to the array
for index, row in filtered_books_data.iterrows():
    book_name = row['Book-Title']
    image_url = row['Image-URL-M']
    book_image_array.append((book_name, image_url))
    print(book_image_array)
# Print the book and image pairs in the array
