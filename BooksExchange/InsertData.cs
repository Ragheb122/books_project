using System;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using BooksExchange.Models;

namespace BooksExchange
{
    public class InsertData
    {
        // returns true if the user's data inserted successfully to the database, and false otherwise.
        static public async Task<bool> NewUser(string name, string email, string mobile, string password, int city, string img, int[] books)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User use = new User()
                    {
                        name = name,
                        email = email,
                        mobile = mobile,
                        password = Helpers.GetMD5Hash(password),
                        token = await Helpers.GetRandomString(),
                        city = city,
                        created_at = DateTime.Now,
                        image = img,
                    };
                    db.Users.Add(use);
                    if (books != null)
                    {
                        if (books.Length > 0)
                        {
                            foreach (int item in books)
                            {
                                BooksRate rate = new BooksRate()
                                {
                                    book_id = item,
                                    rate = 5,
                                    user_id = use.id
                                };
                                db.BooksRates.Add(rate);
                            }
                        }
                    }
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // returns true if successfully inserted the new book to the database.
        static public async Task<bool> NewPost(string title, string description, int id, string img, int[] genera)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    Post post = new Post()
                    {
                        title = title,
                        description = description,
                        user_id = id,
                        image = "http://localhost:1338/" + img,
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                    };
                    db.Posts.Add(post);
                    if (genera != null)
                    {
                        if (genera.Length > 0)
                        {
                            foreach (int? item in genera)
                            {
                                if (item != null)
                                {
                                    PostsGenera gen = new PostsGenera()
                                    {
                                        genera_id = item.Value,
                                        post_id = post.id
                                    };
                                    db.PostsGeneras.Add(gen);
                                }
                            }
                        }
                    }
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        static public async Task<bool> MakeRedeemRequest(string token, int amount)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    GiftRequest request = new GiftRequest()
                    {
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        user_id = await Helpers.GetUserIDByToken(token),
                        requested = amount
                    };
                    db.GiftRequests.Add(request);
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<bool> UserPreferences(string token, int[] id)
        {
            try
            {
                int userId = await Helpers.GetUserIDByToken(token);
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    for(int i = 0; i < id.Length; i++)
                    {
                        int genId = id[i];
                        UserPreference Check = await db.UserPreferences.Where(o => o.user_id == userId && o.generas_id == genId).FirstOrDefaultAsync();
                        if(Check == null)
                        {
                            UserPreference pref = new UserPreference()
                            {
                                generas_id = genId,
                                user_id = userId
                            };
                            db.UserPreferences.Add(pref);
                        }
                        else
                        {
                            Check.count++;
                            db.Entry(Check).State = EntityState.Modified;
                        }
                    }
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // inserting verify code to the database.
        static public async Task<string> CreateVerifyCode(string email)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User user = await db.Users.Where(o => o.email == email).FirstOrDefaultAsync();
                    if (user == null)
                        return "user not registered yet";
                    else
                    {
                        VerifyCode verify = await db.VerifyCodes.Where(o => o.user_id == user.id).FirstOrDefaultAsync();
                        if (verify != null)
                            return "code sent, please check your email!";
                        string code_ = await Helpers.GetCode();
                        VerifyCode code = new VerifyCode()
                        {
                            created_at = DateTime.Now,
                            user_id = user.id,
                            code = code_
                        };
                        db.VerifyCodes.Add(code);
                        await Helpers.SendEmail(email, code_);
                        if(await db.SaveChangesAsync() > 0)
                            return "please check your email!";
                        return "something went wrong please try again!";
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // inserting new category to the database.
        static public async Task<bool> NewCategory(string name)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    Genera gen = await db.Generas.Where(o => o.name.Contains(name)).FirstOrDefaultAsync();
                    if (gen != null)
                        return false;
                    Genera genera = new Genera()
                    {
                        name = name
                    };
                    db.Generas.Add(genera);
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // inserting user rate to the database.
        static public async Task<bool> NewUserRate(int id, int rate, string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    int UserID = await Helpers.GetUserIDByToken(token);
                    UserRate rate_ = await db.UserRates.Where(o => o.user_id == id && o.rated_by == UserID).FirstOrDefaultAsync();
                    if(rate_ != null)
                    {
                        rate_.rate = rate;
                        db.Entry(rate_).State = EntityState.Modified;
                    }
                    else
                    {
                        UserRate NewRate = new UserRate()
                        {
                            user_id = id,
                            rate = rate,
                            rated_by = UserID
                        };
                        db.UserRates.Add(NewRate);
                    }

                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // not relevant
        static public async Task<bool> NewBookRate(int id, string token, int rate)
        {
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                int userID = await Helpers.GetUserIDByToken(token);
                BooksRate book = await db.BooksRates.Where(o => o.book_id == id && o.user_id == userID).FirstOrDefaultAsync();
                if(book != null)
                {
                    book.rate = rate;
                    db.Entry(book).State = EntityState.Modified;
                }
                else
                {
                    BooksRate rate_ = new BooksRate()
                    {
                        book_id = id,
                        rate = rate,
                        user_id = userID
                    };
                    db.BooksRates.Add(rate_);
                }
                if (await db.SaveChangesAsync() > 0)
                    return true;
                else
                    return false;
            }
        }
    }
}