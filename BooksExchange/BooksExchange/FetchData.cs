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
            string pass = Helpers.GetMD5Hash(password);
            password = pass;
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                User user = await db.Users.Where(o => o.email == email && o.password == password).FirstOrDefaultAsync();
                if (user == null)
                    return null;
                else
                {
                    int gen = await db.UserPreferences.Where(o => o.user_id == user.id).CountAsync();
                    List<object> Obj = new List<object>();
                    if (gen != 0)
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
                    else
                    {
                        List<Genera> genras = await db.Generas.ToListAsync();
                        foreach (Genera item in genras)
                        {
                            if (item != null)
                            {
                                object temp = new
                                {
                                    id = item.id,
                                    name = item.name
                                };
                                if (!Obj.Contains(temp))
                                    Obj.Add(temp);
                            }
                        }
                        User user_ = await db.Users.Where(o => o.email == email && o.password == password).FirstOrDefaultAsync();
                        object userInfo = new
                        {
                            id = user_.id,
                            token = user_.token,
                            name = user_.name,
                            image = user_.image,
                            email = user_.email,
                            generas = Obj
                        };
                        return userInfo;
                    }
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
                                        url = item.Post.url
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
        }
        static public async Task<List<object>> GetChats(string token)
        {
            try
            {
                int id = await Helpers.GetUserIDByToken(token);
                List<object> Data = new List<object>();
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<Chat> chats = await db.Chats.Where(o => o.user_one == id || o.user_two == id).ToListAsync();
                    foreach (Chat item in chats)
                    {
                        if (item != null)
                        {
                            Message mess = await db.Messages.Where(o => o.chat_id == item.id).OrderByDescending(p => p.id).FirstOrDefaultAsync();
                            string message = string.Empty;
                            string dateTime = string.Empty;
                            if (mess != null)
                            {
                                message = mess.message1;
                                dateTime = mess.created_at.ToString();
                            }
                            object temp = new
                            {
                                chatID = item.id,
                                lastMessage = message,
                                username = item.User1.name,
                                MessageTime = dateTime
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
        static public async Task<List<object>> GetChatMessages(string token, int chat)
        {
            try
            {
                int id = await Helpers.GetUserIDByToken(token);
                List<object> Data = new List<object>();
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    List<Message> mess = await db.Messages.Where(o => o.chat_id == chat && o.Chat.user_one == id)
                        .OrderByDescending(p=>p.id).ToListAsync();
                    foreach (Message item in mess)
                    {
                        if (item != null)
                        {
                            object temp = new
                            {
                                sender = item.User.name,
                                sendImage = item.User.image,
                                reciver = item.User1.name,
                                reciverImage = item.User1.image,
                                message = item.message1
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
                                    description = item.description
                                };
                                if (!Obj.Contains(temp))
                                    Obj.Add(temp);
                            }
                        }
                    }
                    User user = await db.Users.FindAsync(id);
                    object Data = new
                    {
                        userImage = user.image,
                        mobile = user.mobile,
                        email = user.email,
                        name = user.name,
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
    }
}