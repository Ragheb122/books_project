using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using BooksExchange.Models;
using System.Text;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Diagnostics;

namespace BooksExchange
{
    public static class Helpers
    {
        
        // generating a random code for users token
        static public async Task<string> GetRandomString(int length = 64)
        {
            string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            string s = "";
            using (RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider())
            {
                while (s.Length != length)
                {
                    byte[] oneByte = new byte[1];
                    provider.GetBytes(oneByte);
                    char character = (char)oneByte[0];
                    if (valid.Contains(character))
                    {
                        s += character;
                    }
                }
            }
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                User UserToken = await db.Users.FirstOrDefaultAsync(o => o.token == s);
                if (UserToken != null)
                    return await GetRandomString(64);
                else
                    return s;
            }
        }
        // hashing passwords
        public static string GetMD5Hash(string value)
        {
            try
            {
                MD5 md5Hasher = MD5.Create();
                byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(value));
                StringBuilder sBuilder = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString());
                }
                return sBuilder.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }
        // checking if the given data contains null data
        static public bool NullOrEmpty(string[] Data)
        {
            try
            {
                //loop through the given array to see if it has value or not
                foreach (var item in Data)
                {
                    if (string.IsNullOrEmpty(item) || string.IsNullOrWhiteSpace(item))
                    {
                        //if it doesn't have a value
                        return true;
                    }
                }
                //if they has a value
                return false;
            }
            catch (Exception)
            {

                return true;
            }
        }
        // checking if the given email is in the database.
        static public async Task<bool> EmailExist(string email)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User use = await db.Users.FirstOrDefaultAsync(o => o.email == email);
                    if (use == null)
                        return false;
                    else return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // checking if the phone number is in the database.
        static public async Task<bool> MobileExist(string mobile)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User use = await db.Users.FirstOrDefaultAsync(o => o.mobile == mobile);
                    if (use == null)
                        return false;
                    else return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // given user's id, return user's token.
        static public async Task<string> GetUserTokenByID(int id)
        {
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                User u = await db.Users.FindAsync(id);
                if (u == null)
                    return "0";
                else
                    return u.token;
            }
        }
        // given user's token, return user's id.
        static public async Task<int> GetUserIDByToken(string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User u = await db.Users.FirstOrDefaultAsync(o => o.token == token);
                    if (u == null)
                        return 0;
                    else
                        return u.id;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<string> GetTokenIDByEmail(string email)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User u = await db.Users.FirstOrDefaultAsync(o => o.email == email);
                    if (u == null)
                        return "";
                    else
                        return u.token;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        // given token, check if the relevant user exists in the databse.
        static public async Task<bool> UserExist(string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User user = await db.Users.FirstOrDefaultAsync(o => o.token == token);
                    if (user != null)
                        return true;
                    else return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // given user's token and post id, return true if the post exist and false otherwise.
        static public async Task<bool> PostOwner(string token, int postID)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    int? id = await GetUserIDByToken(token);
                    if (id.Value != 0)
                    {
                        Post post = await db.Posts.FirstOrDefaultAsync(o => o.id == postID && o.user_id == id);
                        if (post != null)
                            return true;
                        else return false;
                    }
                    else
                        return false;

                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // check if user traded enough books to redeem a gift card.
        static public async Task<bool> haveEnoghBooksToRedeem(string token, int requested)
        {
            try
            {
                int? id = await GetUserIDByToken(token);
                if (id.Value != 0)
                {
                    using (book_exchangeEntities db = new book_exchangeEntities())
                    {
                        int count = await db.Posts.Where(o => o.user_id == id.Value && o.traded == true && o.redeemed == false).CountAsync();
                        if (count >= requested)
                        {
                            return true;
                        }
                        else
                            return false;
                    }
                }
                else
                    return false;

            }
            catch (Exception)
            {

                throw;
            }
        }
        // given user's token, check if the user is admin.
        static public async Task<bool> IsAdmin(string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User user = await db.Users.Where(o => o.token == token).FirstOrDefaultAsync();
                    if (user != null)
                        if (user.admin)
                            return true;
                    return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        //
        // mend list of books to user based on his choices of favorite books.
        // got the template of the code from ChatGPT.
        static public async Task<List<object>> recommentionSysAsync(string token, int check)
        {
            string pythonFilePath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\main.py";
            if (check == 1)
            {
                pythonFilePath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\top100.py";
            }
            string booksCsvPath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\Books.csv";
            string usersCsvPath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\Users.csv";
            string ratingsCsvPath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\Ratings.csv";
            string[] additionalArgs = await FetchData.UserFavBooks(token);

            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.FileName = "python";
            startInfo.Arguments = $"\"{pythonFilePath}\" \"{booksCsvPath}\" \"{usersCsvPath}\" \"{ratingsCsvPath}\"";

            // Append additional arguments to the command line
            foreach (string arg in additionalArgs)
            {
                startInfo.Arguments += $" \"{arg}\"";
            }

            startInfo.UseShellExecute = false;
            startInfo.RedirectStandardOutput = true;
            startInfo.RedirectStandardError = true;

            using (Process process = new Process())
            {
                process.StartInfo = startInfo;
                process.Start();

                // Read the output from the Python script
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                string[] lines = output.Split(new[] { Environment.NewLine }, StringSplitOptions.None);
                List<Book_> books = new List<Book_>();
                foreach (string line in lines)
                {
                    string[] parts = line.Split(',');
                    if (parts[0] == "")
                    {
                        break;
                    }
                    Book_ book = new Book_();
                    char charToRemove1 = '[';
                    char charToRemove2 = ']';
                    char charToRemove3 = '\'';

                    string result1 = parts[0].Replace(charToRemove1.ToString(), string.Empty);
                    string result2 = parts[3].Replace(charToRemove2.ToString(), string.Empty);
                    string result3 = result2.Replace(charToRemove3.ToString(), string.Empty);
                    string isbn = result1.Replace(charToRemove3.ToString(), string.Empty);
                    string title = parts[1].Replace(charToRemove3.ToString(), string.Empty);
                    string author = parts[2].Replace(charToRemove3.ToString(), string.Empty);
                    string finalTitle = title;
                    string finalAuthor = author;
                    if (title[0] == ' ')
                    {
                        finalTitle = title.Substring(1);
                    }
                    if (author[0] == ' ')
                    {
                        finalAuthor = author.Substring(1);
                    }
                    book.ISBN = isbn;
                    book.Title = finalTitle;
                    book.Author = finalAuthor;
                    book.image = result3;
                    books.Add(book);
                }
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<object> data = new List<object>();
                    List<string> booksNames = new List<string>();
                    List<object> posts = await FetchData.GetPosts();
                    List<string> poststitlesList = posts.Select(obj => obj.GetType().GetProperty("title").GetValue(obj,null).ToString()).ToList();
                    foreach (Book_ book in books)
                    {
                        // Console.WriteLine("book ISBN is:" + book.ISBN + "\n" + "book Title is:" + book.Title + "\n" + "author is:" + book.Author + "\n" + "image url is:" + book.image);
                        object rate = new { rate = 0, amount = 0 };
                        bool found = false;
                        int relevantPostID = 0;
                        foreach (object t in posts)
                        {
                            // t1 is recommended Book's title
                            string t1 = (string)t.GetType().GetProperty("title").GetValue(t, null).ToString();
                            // t1 is recommended Book's relevant post ID
                            int t_PostID = (int)t.GetType().GetProperty("id").GetValue(t, null);
                            if (t1 == book.Title)
                            {
                                found = true;
                                relevantPostID = t_PostID;
                            }
                        }
                        object temp = new
                        {
                            relevantPost = relevantPostID,
                            id = book.ISBN,
                            isFound = found,
                            title = book.Title,
                            image = book.image,
                            description = "Author:" + Environment.NewLine + book.Author + Environment.NewLine
                            + "ISBN:" + Environment.NewLine + book.ISBN,
                            traded = false,
                            url = "-",
                            rate = rate
                        };

                        recommendtion r = new recommendtion()
                        {
                            relevantPost = relevantPostID,
                            is_found = found,
                            description = "Author:" + Environment.NewLine + book.Author + Environment.NewLine
                            + "ISBN:" + Environment.NewLine + book.ISBN,
                            image = book.image,
                            title = book.Title,
                            url = book.image,
                            user_id = await GetUserIDByToken(token)
                        };
                        db.recommendtions.Add(r);
                        string newName = (string)temp.GetType().GetProperty("title").GetValue(temp, null);
                        if (!data.Contains(temp))
                            booksNames.Add(newName);
                            data.Add(temp);
                    }
                    await db.SaveChangesAsync();
                    return data;
                }
            }
        }
        // return list of most popular books.
        static public List<object> top100books()
        {
            string pythonFilePath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\top100.py";
            string booksCsvPath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\Books.csv";
            string usersCsvPath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\Users.csv";
            string ratingsCsvPath = @"C:\computer science\4th\project\cloneGithub-BooksExchange\books_project\books recommendation\Ratings.csv";

            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.FileName = "python";
            startInfo.Arguments = $"\"{pythonFilePath}\" \"{booksCsvPath}\" \"{usersCsvPath}\" \"{ratingsCsvPath}\"";

            // Append additional arguments to the command line

            startInfo.UseShellExecute = false;
            startInfo.RedirectStandardOutput = true;
            startInfo.RedirectStandardError = true;

            using (Process process = new Process())
            {
                process.StartInfo = startInfo;
                process.Start();

                // Read the output from the Python script
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                string[] lines = output.Split(new[] { Environment.NewLine }, StringSplitOptions.None);
                List<Book_> books = new List<Book_>();
                foreach (string line in lines)
                {
                    string[] parts = line.Split(',');
                    if (parts[0] == "")
                    {
                        break;
                    }
                    Book_ book = new Book_();
                    char charToRemove1 = '[';
                    char charToRemove2 = ']';
                    char charToRemove3 = '\'';

                    string result1 = parts[0].Replace(charToRemove1.ToString(), string.Empty);
                    string result2 = parts[3].Replace(charToRemove2.ToString(), string.Empty);
                    string result3 = result2.Replace(charToRemove3.ToString(), string.Empty);
                    string isbn = result1.Replace(charToRemove3.ToString(), string.Empty);
                    string title = parts[1].Replace(charToRemove3.ToString(), string.Empty);
                    string author = parts[2].Replace(charToRemove3.ToString(), string.Empty);
                    string finalTitle = title;
                    string finalAuthor = author;
                    if (title[0] == ' ')
                    {
                        finalTitle = title.Substring(1);
                    }
                    if (author[0] == ' ')
                    {
                        finalAuthor = author.Substring(1);
                    }
                    book.ISBN = isbn;
                    book.Title = finalTitle;
                    book.Author = finalAuthor;
                    book.image = result3;
                    books.Add(book);
                }
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<object> data = new List<object>();
                    foreach (Book_ book in books)
                    {
                        // Console.WriteLine("book ISBN is:" + book.ISBN + "\n" + "book Title is:" + book.Title + "\n" + "author is:" + book.Author + "\n" + "image url is:" + book.image);
                        object rate = new { rate = 0, amount = 0 };
                        object temp = new
                        {
                            id = book.ISBN,
                            title = book.Title,
                            image = book.image,
                            description = "Author:" + Environment.NewLine + book.Author + Environment.NewLine
                            + "ISBN:" + Environment.NewLine + book.ISBN,
                            traded = false,
                            url = "-",
                            rate = rate
                        };
                        if (!data.Contains(temp))
                            data.Add(temp);
                    }
                    return data;
                }
            }
        }
        // save the most popular books in a static list.
        public static List<object> finaldata = top100books();
        // check if a user have recommendation.
        static public async Task<bool> HaveRecommendtion(int id)
        {
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                recommendtion r = await db.recommendtions.FirstOrDefaultAsync(o => o.user_id == id);
                if (r == null)
                    return false;
                else
                    return true;
            }
        }
    }

    class Book_
    {
        public string ISBN { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string image { get; set; }
    }
}