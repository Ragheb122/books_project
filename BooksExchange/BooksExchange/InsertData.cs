using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Data.Entity;
using BooksExchange.Models;

namespace BooksExchange
{
    public class InsertData
    {
        static public async Task<bool> NewUser(string name, string email, string mobile, string password, int city, string img)
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
                        image = img
                    };
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
                        image = img,
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                    };
                    db.Posts.Add(post);
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
        static public async Task<object> NewChat(string token, int userID)
        {
            try
            {
                int id = await Helpers.GetUserIDByToken(token);
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    Chat check = await db.Chats.Where(o => o.user_one == id && o.user_two == userID).FirstOrDefaultAsync();
                    if (check != null)
                    {
                        object data = new
                        {
                            ReciverName = check.User1.name,
                            ReciverImage = check.User1.image,
                            ChatId = check.id,
                            messages = await FetchData.GetChatMessages(token, check.id)
                        };
                        return data;
                    }
                    Chat chat = new Chat()
                    {
                        created_at = DateTime.Now,
                        user_one = id,
                        user_two = userID
                    };
                    db.Chats.Add(chat);
                    if (await db.SaveChangesAsync() > 0)
                    {
                        object data = new
                        {
                            ReciverName = chat.User1.name,
                            ReciverImage = chat.User1.image,
                            ChatId = chat.id
                        };
                        return data;
                    }
                    else
                    {
                        object data = new { };
                        return data;
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<bool> NewMessage(string token, int ChatId, string message, int userID)
        {
            try
            {
                int id = await Helpers.GetUserIDByToken(token);
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    Chat chat = await db.Chats.Where(o => o.id == ChatId && o.user_one == id || o.user_two == id).FirstOrDefaultAsync();
                    if (chat == null)
                        return false;
                    Message mess = new Message()
                    {
                        chat_id = ChatId,
                        created_at = DateTime.Now,
                        message1 = message,
                        sent_by = id,
                        recived_by = userID
                    };
                    db.Messages.Add(mess);
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
    }
}