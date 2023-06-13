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
                                favBook rate = new favBook()
                                {
                                    book_id = item,
                                    user_id = use.id
                                };
                                db.favBooks.Add(rate);
                            }
                        }
                    }
                    if (await db.SaveChangesAsync() > 0)
                    {
                        _ = Task.Run(async () =>
                        {
                            int a = await Helpers.recommentionSysAsync(use.token);
                            // Perform any necessary background operations here
                        });

                        return true;
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
                        approved = true
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
    }
}