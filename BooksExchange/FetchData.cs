﻿using System;
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
            string pass = Helpers.GetMD5Hash(password);
            password = pass;
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                User user = await db.Users.Where(o => o.email == email && o.password == password).FirstOrDefaultAsync();
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
                        email = user.email,
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
                    List<Post> posts = await db.Posts.Where(o => o.approved == true && o.url == null).OrderByDescending(p => p.id).ToListAsync();
                    List<object> Obj = new List<object>();
                    foreach (Post item in posts)
                    {
                        if (item != null)
                        {
                            List<object> generas = new List<object>();
                            List<PostsGenera> gens = await db.PostsGeneras.Where(o => o.post_id == item.id).ToListAsync();
                            foreach (PostsGenera items in gens)
                            {
                                if (items != null)
                                {
                                    object tem = new
                                    {
                                        id = items.genera_id,
                                        name = items.Genera.name
                                    };
                                    if (!generas.Contains(tem))
                                        generas.Add(tem);
                                }
                            }
                            object temp = new
                            {
                                id = item.id,
                                title = item.title,
                                image = item.image,
                                description = item.description,
                                traded = item.traded,
                                userID = item.User.id,
                                userName = item.User.name,
                                userImage = item.User.image,
                                locationID = item.User.city,
                                location = item.User.City1.name,
                                rate = await bookRate(item.id),
                                cateories = generas
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
        static public async Task<List<object>> GetAllPosts()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<Post> posts = await db.Posts.Where(o => o.approved == false && o.url == null).OrderByDescending(p => p.id).ToListAsync();
                    List<object> Obj = new List<object>();
                    foreach (Post item in posts)
                    {
                        if (item != null)
                        {
                            List<object> generas = new List<object>();
                            List<PostsGenera> gens = await db.PostsGeneras.Where(o => o.post_id == item.id).ToListAsync();
                            foreach (PostsGenera items in gens)
                            {
                                if (items != null)
                                {
                                    object tem = new
                                    {
                                        id = items.genera_id,
                                        name = items.Genera.name
                                    };
                                    if (!generas.Contains(tem))
                                        generas.Add(tem);
                                }
                            }
                            object temp = new
                            {
                                id = item.id,
                                title = item.title,
                                image = item.image,
                                description = item.description,
                                traded = item.traded,
                                userID = item.User.id,
                                userName = item.User.name,
                                userImage = item.User.image,
                                locationID = item.User.city,
                                location = item.User.City1.name,
                                rate = await bookRate(item.id),
                                categories = generas
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
                                url = item.url,
                                rate = await bookRate(item.id)
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
        static public async Task<List<object>> GetPostsByRef(int id)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<object> Data = new List<object>();
                    List<BooksRate> booksrate = await db.BooksRates.Where(o => o.user_id == id).ToListAsync();
                    List<long> ratedByOther = new List<long>();
                    List<long> middleMan = new List<long>();
                    foreach (BooksRate item in booksrate)
                    {
                        if (item != null)
                        {
                            List<BooksRate> RatedByOthers = await db.BooksRates.Where(o => o.book_id == item.book_id).ToListAsync();
                            foreach (BooksRate gathere in RatedByOthers)
                            {
                                if (gathere != null)
                                {
                                    //int count = await db.BooksRates.Where(o => o.user_id == id).CountAsync();
                                    int count = 100;
                                    if(count >= 100)
                                    {
                                        object gathered = new
                                        {
                                            user = gathere.user_id,
                                        };
                                        if (!ratedByOther.Contains(gathere.user_id))
                                            ratedByOther.Add(gathere.user_id);
                                    }

                                }
                            }
                            if (!middleMan.Contains(item.id))
                                middleMan.Add(item.id);
                        }
                    }
                    List<int> results = new List<int>();
                    foreach (int? item in ratedByOther)
                    {
                        if (item != null)
                        {
                            int BookId = item.Value;
                            List<BooksRate> brate = await db.BooksRates.Where(o => o.user_id == BookId).OrderByDescending(p=>p.rate).ToListAsync();
                            foreach (BooksRate Brate in brate)
                            {
                                if (Brate != null)
                                {
                                    object BRate = new
                                    {
                                        book = Brate.id
                                    };
                                    if (!middleMan.Contains(Brate.id) && !results.Contains(Brate.id))
                                        results.Add(Brate.id);
                                }
                            }
                        }
                    }
                    int totalCheck = 0;
                    foreach (int? item in results)
                    {
                        if (item != null)
                        {
                            int Book = item.Value;
                            Post post = await db.Posts.FindAsync(Book);
                            if (post != null)
                            {
                                List<object> generas = new List<object>();
                                List<PostsGenera> gens = await db.PostsGeneras.Where(o => o.post_id == Book).ToListAsync();
                                foreach (PostsGenera items in gens)
                                {
                                    if (items != null)
                                    {
                                        object tem = new
                                        {
                                            id = items.genera_id,
                                            name = items.Genera.name
                                        };
                                        if (!generas.Contains(tem))
                                            generas.Add(tem);
                                    }
                                }
                                object temp = new
                                {
                                    id = post.id,
                                    title = post.title,
                                    image = post.image,
                                    description = post.description,
                                    traded = post.traded,
                                    userID = post.User.id,
                                    userName = post.User.name,
                                    userImage = post.User.image,
                                    url = post.url,
                                    locationID = post.User.city,
                                    location = post.User.City1.name,
                                    rate = await bookRate(post.id),
                                    categories = generas
                                };
                                if (!Data.Contains(temp))
                                    Data.Add(temp);
                                totalCheck++;
                                if (totalCheck == 200)
                                    break;
                            }
                        }
                    }

                    return Data;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        /*
        static public async Task<List<object>> GetPostsByRef(int id)
        {
            try
            {
                List<object> Data = new List<object>();
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<UserPreference> userPref = await db.UserPreferences.Where(o => o.user_id == id).OrderByDescending(p=>p.count)
                        .ToListAsync();
                    foreach (UserPreference prefs in userPref)
                    {
                        if (prefs != null)
                        {
                            string prefName = prefs.Genera.name;
                            List<PostsGenera> posts = await db.PostsGeneras.Where(o => o.Genera.name.Contains(prefName) ||
                            o.Post.title.Contains(prefName) || o.Post.description.Contains(prefName) && o.Post.approved == true)
                            .OrderBy(p=> Guid.NewGuid()).ToListAsync();
                            foreach (PostsGenera item in posts)
                            {
                                if (item != null)
                                {
                                    List<object> generas = new List<object>();
                                    List<PostsGenera> gens = await db.PostsGeneras.Where(o => o.post_id == item.post_id).ToListAsync();
                                    foreach (PostsGenera items in gens)
                                    {
                                        if (items != null)
                                        {
                                            object tem = new
                                            {
                                                id = items.genera_id,
                                                name = items.Genera.name
                                            };
                                            if (!generas.Contains(tem))
                                                generas.Add(tem);
                                        }
                                    }
                                    object temp = new
                                    {
                                        id = item.post_id,
                                        title = item.Post.title,
                                        image = item.Post.image,
                                        description = item.Post.description,
                                        traded = item.Post.traded,
                                        userID = item.Post.User.id,
                                        userName = item.Post.User.name,
                                        userImage = item.Post.User.image,
                                        url = item.Post.url,
                                        locationID = item.Post.User.city,
                                        location = item.Post.User.City1.name,
                                        categories = generas
                                    };
                                    if(!Data.Contains(temp))
                                        Data.Add(temp);
                                }
                            }
                        }
                    }
                }
                return Data;
            }
            catch (Exception)
            {

                throw;
            }
        }*/
        static public async Task<object> GetPostByID(int id)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    Post post = await db.Posts.FindAsync(id);
                    if(post == null)
                    {
                        object temp = new
                        {

                        };
                        return temp;
                    }
                    else if(post.approved)
                    {
                        List<object> obj = new List<object>();
                        List<PostsGenera> gen = await db.PostsGeneras.Where(o => o.post_id == id).ToListAsync();
                        foreach (PostsGenera item in gen)
                        {
                            if (item != null)
                            {
                                object temp = new
                                {
                                    generaID = item.genera_id,
                                    name = item.Genera.name
                                };
                                if (!obj.Contains(temp))
                                    obj.Add(temp);
                            }
                        }
                        object data = new
                        {
                            id = post.id,
                            title = post.title,
                            description = post.description,
                            image = post.image,
                            userID = post.user_id,
                            userName = post.User.name,
                            userImage = post.User.image,
                            traded = post.traded,
                            created_at = post.created_at,
                            url = post.url,
                            locationID = post.User.city,
                            locattion = post.User.City1.name,
                            rate = await bookRate(post.id),
                            categories = obj
                        };
                        return data;
                    }
                    else
                    {
                        object temp = new
                        {

                        };
                        return temp;
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<object> UserInfoById(int id, bool profile)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<object> Obj = new List<object>();
                    if (profile)
                    {
                        List<Post> posts = await db.Posts.Where(o => o.user_id == id && o.approved == true).OrderByDescending(p => p.id).ToListAsync();
                        foreach (Post item in posts)
                        {
                            if (item != null)
                            {
                                object temp = new
                                {
                                    id = item.id,
                                    image = item.image,
                                    traded = item.traded,
                                    title = item.title,
                                    description = item.description,
                                    locationID = item.User.city,
                                    location = item.User.City1.name,
                                    rate = await bookRate(item.id)
                                };
                                if (!Obj.Contains(temp))
                                    Obj.Add(temp);
                            }
                        }
                    }
                    User user = await db.Users.FindAsync(id);
                    object rate = await getUserRate(user.id);
                    object Data = new
                    {
                        userID = user.id,
                        userImage = user.image,
                        mobile = user.mobile,
                        email = user.email,
                        name = user.name,
                        rate = rate,
                        locationID = user.city,
                        location = user.City1.name,
                        posts = Obj
                    };
                    return Data;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<List<object>> GetUsers(string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<User> users = await db.Users.Where(o=>o.token != token).OrderByDescending(p=>p.id).ToListAsync();
                    List<object> Data = new List<object>();
                    foreach (User item in users)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.id,
                                name = item.name,
                                email = item.email,
                                city = item.City1.name,
                                created_at = item.created_at,
                                image = item.image,
                                admin = item.admin,
                                mobile = item.mobile,
                                token = item.token
                            };
                            if (!Data.Contains(temp))
                                Data.Add(temp);
                        }
                    }
                    return Data;
                }
            }
            catch (Exception)
            {

                throw;
            }
        } 
        static public async Task<List<object>> GetRedeemRequests()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<GiftRequest> gift = await db.GiftRequests.ToListAsync();
                    List<object> Data = new List<object>();
                    foreach (GiftRequest item in gift)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                               id = item.id,
                               username = item.User.name,
                               amount = item.requested,
                               status = item.sent
                            };
                            if (!Data.Contains(temp))
                                Data.Add(temp);
                        }
                    }
                    return Data;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<List<object>> GetSentGifts()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<GiftRequest> gift = await db.GiftRequests.Where(o=>o.sent == true).OrderByDescending(p=>p.updated_at).ToListAsync();
                    List<object> Data = new List<object>();
                    foreach (GiftRequest item in gift)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.id,
                                username = item.User.name,
                                amount = item.requested,
                                sentAt = item.updated_at,
                                status = item.sent
                            };
                            if (!Data.Contains(temp))
                                Data.Add(temp);
                        }
                    }
                    return Data;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<List<object>> GetCategories()
        {
            try
            {
                List<object> Data = new List<object>();
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<Genera> generas = await db.Generas.Where(o => o.deleted == false).ToListAsync();
                    foreach (Genera item in generas)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.id,
                                name = item.name
                            };
                            if (!Data.Contains(temp))
                                Data.Add(temp);
                        }
                    }
                }
                return Data;
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<List<object>> GetCities()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<City> city = await db.Cities.ToListAsync();
                    List<object> data = new List<object>();
                    foreach (City item in city)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.id,
                                name = item.name
                            };
                            if (!data.Contains(temp))
                                data.Add(temp);
                        }
                    }
                    return data;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<object> getUserRate(int id)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<UserRate> rate = await db.UserRates.Where(o => o.user_id == id).ToListAsync();
                    int Rate = 0;
                    int count = 0;
                    foreach (UserRate item in rate)
                    {
                        if (item != null)
                        {
                            Rate += item.rate;
                            count++;
                        }
                    }
                    if (count > 0)
                        Rate = Rate / count;
                    object temp = new
                    {
                        rate = Rate,
                        amount = rate.Count()
                    };
                    return temp;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<object> bookRate(int id)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<BooksRate> rate = await db.BooksRates.Where(o => o.book_id == id).ToListAsync();
                    List<object> obj = new List<object>();
                    int Rate = 0;
                    foreach (BooksRate item in rate)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.id
                            };
                            if (!obj.Contains(temp))
                            {
                                obj.Add(temp);
                                Rate = item.rate;
                            }
                        }
                    }
                    object result = new
                    {
                        rate = Rate,
                        amount = obj.Count()
                    };
                    return result;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        
        static public async Task<List<object>> TopBooks()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<BooksRate> posts = await db.BooksRates.Where(o => o.Post.url != null).OrderByDescending(p => p.rate).Take(50).ToListAsync();
                    List<object> Obj = new List<object>();
                    foreach (BooksRate item in posts)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                id = item.book_id,
                                title = item.Post.title,
                                image = item.Post.image,
                                description = item.Post.description,
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
        
    }
}