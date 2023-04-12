using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using BooksExchange.Models;
using System.Threading.Tasks;

namespace BooksExchange
{
    public class FetchData
    {
        static public async Task<object> CheckLogin(string email, string password)
        {
            password = Helpers.GetMD5Hash(password);
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                User user = await db.Users.FirstOrDefaultAsync(o => o.email == email && o.password == password);
                if (user == null)
                    return null;
                else
                {
                    object userInfo = new
                    {
                        id = user.id,
                        token = user.token,
                        name = user.name,
                        image = user.image,
                        email = user.email
                    };
                    return userInfo;
                }
            }
        }
        static public async Task<List<object>> GetPosts()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<Post> posts = await db.Posts.Where(o => o.approved == true).OrderByDescending(p => p.id).ToListAsync();
                    List<object> Obj = new List<object>();
                    foreach (Post item in posts)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.id,
                                title = item.title,
                                image = item.image,
                                description = item.description,
                                traded = item.traded,
                                userID = item.User.id,
                                userName =item.User.name,
                                userImage =item.User.image,
                            };
                            if (!Obj.Contains(temp))
                                Obj.Add(temp);
                        }
                    }
                    return Obj;
                }
            }
            catch (Exception)
            {

                throw;
            }
        } 
        static public async Task<List<object>> GetStaticsPosts()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<Post> posts = await db.Posts.Where(o => o.url != null).OrderByDescending(p => p.id).ToListAsync();
                    List<object> Obj = new List<object>();
                    foreach (Post item in posts)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.id,
                                title = item.title,
                                image = item.image,
                                description = item.description,
                                url = item.url
                            };
                            if (!Obj.Contains(temp))
                                Obj.Add(temp);
                        }
                    }
                    return Obj;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<object> GivenAndTakenBooksCount(bool vistor, int? id, string token)
        {
            if (vistor == false)
                id = await Helpers.GetUserIDByToken(token);
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                object Info = new
                {
                    Given = await db.Posts.Where(o => o.traded == true && o.user_id == id.Value).CountAsync(),
                };
                return Info;
            }
        }
    }
}