import pandas as pd

books_data = pd.read_csv('Books.csv')
ratings_data = pd.read_csv('Ratings.csv')
isbn_counts = ratings_data['ISBN'].value_counts()
top_50_isbn = isbn_counts.head(50).index

book_names = books_data.loc[books_data['ISBN'].isin(top_50_isbn), 'Book-Title'].values
print(book_names)