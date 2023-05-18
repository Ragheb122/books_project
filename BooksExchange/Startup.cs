using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Owin;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using System.Web.Services.Description;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartup(typeof(BooksExchange.Startup))]
namespace BooksExchange
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}