import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")
from sklearn.metrics.pairwise import cosine_similarity

books = pd.read_csv("Books.csv")
users = pd.read_csv("Users.csv")
ratings = pd.read_csv("Ratings.csv")

ratings_with_name = ratings.merge(books,on='ISBN')
ratings_with_name.drop(columns=["ISBN","Image-URL-S","Image-URL-M"],axis=1,inplace=True)
complete_df = ratings_with_name.merge(users.drop("Age", axis=1), on="User-ID")
complete_df['Location'] = complete_df['Location'].str.split(',').str[-1].str.strip()


avg_rating_df = complete_df.groupby('Book-Title').mean()['Book-Rating'].reset_index()
avg_rating_df.rename(columns={'Book-Rating': 'avg_ratings'}, inplace=True)

num_rating_df = complete_df.groupby('Book-Title').count()['Book-Rating'].reset_index()
num_rating_df.rename(columns={'Book-Rating': 'num_ratings'}, inplace=True)
num_rating_df.head(10)

popularity_df = num_rating_df.merge(avg_rating_df, on='Book-Title')
x = complete_df.groupby('User-ID').count()['Book-Rating']>200
knowledgable_users = x[x].index
filtered_rating = complete_df[complete_df['User-ID'].isin(knowledgable_users)]

y = filtered_rating.groupby('Book-Title').count()['Book-Rating']>=50
famous_books = y[y].index

final_ratings =  filtered_rating[filtered_rating['Book-Title'].isin(famous_books)]
pt = final_ratings.pivot_table(index='Book-Title',columns='User-ID',values='Book-Rating')
pt.fillna(0,inplace=True)

similarity_score = cosine_similarity(pt)

def recommend(book_name):
    index = np.where(pt.index == book_name)[0]
    if len(index) > 0:
        index = np.where(pt.index==book_name)[0][0]

        similar_books = sorted(list(enumerate(similarity_score[index])),key=lambda x:x[1], reverse=True)[1:10]

        data = []

        for i in similar_books:
            item = []
            temp_df = books[books['Book-Title'] == pt.index[i[0]]]
            item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Title'].values))

            data.append(item)
        return data
    else:
        print("book not found")
        return []

data = recommend("harry potter")
for d in data:
    print(d)
