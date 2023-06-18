import sys

import numpy as np  # linear algebra
import pandas as pd  # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")
from sklearn.metrics.pairwise import cosine_similarity

books_csv_path = sys.argv[1]
users_csv_path = sys.argv[2]
ratings_csv_path = sys.argv[3]
additional_args = sys.argv[4:]

# Read the CSV files into DataFrames
books = pd.read_csv(books_csv_path)
users = pd.read_csv(users_csv_path)
ratings = pd.read_csv(ratings_csv_path)

# Merge ratings with book information
ratings_with_name = ratings.merge(books, on='ISBN')
ratings_with_name.drop(columns=["ISBN", "Image-URL-S", "Image-URL-M"], axis=1, inplace=True)

# Merge complete rating data with user information, dropping the 'Age' column
complete_df = ratings_with_name.merge(users.drop("Age", axis=1), on="User-ID")


# Calculate average ratings per book
avg_rating_df = complete_df.groupby('Book-Title').mean()['Book-Rating'].reset_index()
avg_rating_df.rename(columns={'Book-Rating': 'avg_ratings'}, inplace=True)

# Calculate number of ratings per book
num_rating_df = complete_df.groupby('Book-Title').count()['Book-Rating'].reset_index()
num_rating_df.rename(columns={'Book-Rating': 'num_ratings'}, inplace=True)

# Merge number of ratings and average ratings into a popularity DataFrame
popularity_df = num_rating_df.merge(avg_rating_df, on='Book-Title')

# Filter out users who have rated more than 200 books
x = complete_df.groupby('User-ID').count()['Book-Rating'] > 200
knowledgeable_users = x[x].index
filtered_rating = complete_df[complete_df['User-ID'].isin(knowledgeable_users)]

# Filter out books with at least 50 ratings
y = filtered_rating.groupby('Book-Title').count()['Book-Rating'] >= 50
famous_books = y[y].index

# Filter the final ratings DataFrame based on famous books
final_ratings = filtered_rating[filtered_rating['Book-Title'].isin(famous_books)]

# Create a pivot table with Book-Title as the index and User-ID as the columns
pt = final_ratings.pivot_table(index='Book-Title', columns='User-ID', values='Book-Rating')
pt.fillna(0, inplace=True)

# Calculate cosine similarity between books using the pivot table
similarity_score = cosine_similarity(pt)

# Function to recommend similar books based on a given book name
def recommend(book_name):
    index = np.where(pt.index == book_name)[0]
    # check if the book's name exists in the database.
    if len(index) > 0:
        index = np.where(pt.index == book_name)[0][0]
        similar_books = sorted(list(enumerate(similarity_score[index])), key=lambda x: x[1], reverse=True)[1:10]

        data = []

        for i in similar_books:
            item = []
            temp_df = books[books['Book-Title'] == pt.index[i[0]]]
            item.extend(list(temp_df.drop_duplicates('Book-Title')['ISBN'].values))
            item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Title'].values))
            item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Author'].values))
            item.extend(list(temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values))

            data.append(item)
        return data
    else:
        return []

def recommendBooks(books):
    res = []
    for book in books:
        res += recommend(book)
    return res
    # Print the recommended books for the given books
# print(recommendBooks(["A Prayer for Owen Meany","Snow Falling on Cedars","The Summons",
#                       "Wild Animus",
#                       "House of Sand and Fog",]))

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python main.py <Books_CSV_Path> <Users_CSV_Path> <Ratings_CSV_Path> [additional_args...]")
        sys.exit(1)
    if len(additional_args) == 0:
        books_data = pd.read_csv(sys.argv[1])
        ratings_data = pd.read_csv(sys.argv[3])
        isbn_counts = ratings_data['ISBN'].value_counts()
        top_50_isbn = isbn_counts.head(50).index

        # Filter books_data based on the top 50 ISBN values and retrieve the "Book-Title" and "Image-URL-M" columns
        filtered_books_data = books_data.loc[books_data['ISBN'].isin(top_50_isbn), ['ISBN', 'Book-Title', 'Book-Author', 'Image-URL-M']]

        # Create an empty array to store book and image pairs
        book_image_array = []

        # Iterate over the filtered_books_data and add each book with its image URL to the array
        for index, row in filtered_books_data.iterrows():
            book_ISBN = row['ISBN']
            book_name = row['Book-Title']
            book_author = row['Book-Author']
            image_url = row['Image-URL-M']

        # Print the book and image pairs in the array
    # Read the CSV files into DataFrames
    else:
        books = pd.read_csv(books_csv_path)
        users = pd.read_csv(users_csv_path)
        ratings = pd.read_csv(ratings_csv_path)
        l = []
        for arg in additional_args:
            l.append(arg)
        recommended_books = recommendBooks(l)
        for book in recommended_books:
            print(book)


