# books_project
To start the project you need to:

1- download the relevant libraries from requerments.txt

# to start the backend:
1-open BookExchange.sln then go to models then to model1.edmx in the solution explorer

2- right click in inside the file and press generata database from model and copy the appeared string

3- open sql server managment then create new data base, name it book_exchange.

4- create new query and paste on it the copied string and then execute the query and run the queries that is in quiries.txt.

5- open web.config file, go to the connectionstring and change data source=DESKTOP-BPQ03DC to the source of your sql server
![connect (1)](https://github.com/yousefm3/books_project/assets/96112309/a49bdf34-6bc0-425b-870a-627a10c211d3)

![image](https://github.com/yousefm3/books_project/assets/96112309/0b053781-51dd-476b-93cb-6532470ba322)

6-go to Helpers.cs then to recommentionSysAsync function then change the paths according to your path
![image](https://github.com/yousefm3/books_project/assets/96112309/a3eb4f2c-2496-4467-aaca-49e0742bd902)

7- Now you can run the backend server

8- to start the flask server for the recommendation systems
   -run chatgpt.py

# now to start the frontend:
1- open books-react folder
  - to start the main web go to books-ibrary folder and then in the command line write npm -install --force then npm start
  - to start the admin dash board go to book-dashboard folder then in the command line write npm -install --force then npm start


