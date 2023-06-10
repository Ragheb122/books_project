using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using BooksExchange;
using BooksExchange.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

[TestClass]
public class DefaultControllerTests
{

    [TestMethod]
    public async Task Register_InvalidData_ReturnsBadRequestJson()
    {
        // Arrange
        var controller = new DefaultController();
        controller.ControllerContext = new ControllerContext();
        controller.Url = new UrlHelper(new RequestContext(controller.HttpContext, new RouteData()), new RouteCollection());
        var city = 1;
        var name = "John Doe";
        var email = "johndoe1@example12.comm";
        var mobile = "9999999999985";
        var books = new int[] { };
        var password = "password1";
        var repassword = "password1";
        HttpPostedFileBase image = null;
        // Act
        var result = await controller.Register(null, city, name, email, mobile, books, password, repassword, image) as JsonResult;

        // Assert
        Assert.IsNotNull(result);
        object data = result.Data;
        HttpStatusCode t2 = (HttpStatusCode)data.GetType().GetProperty("code").GetValue(data, null);
        var t1 = data.GetType().GetProperties().ToList();
        if (t1[1].Name == "error")
        {
            string t4 = (string)data.GetType().GetProperty("error").GetValue(data, null);
            Assert.AreEqual("", t4);
        }
        Assert.AreEqual(HttpStatusCode.OK, t2);
    }
    [TestMethod]
    public async Task Login_method()
    {
        // Arrange
        var controller = new DefaultController();
        controller.ControllerContext = new ControllerContext();
        controller.Url = new UrlHelper(new RequestContext(controller.HttpContext, new RouteData()), new RouteCollection());
        var email = "raghep-119@hotmail.com";
        var password = "raghep-119@hotmail.com";
        // Act
        var result = await controller.Login(email, password) as JsonResult;

        // Assert
        object data = result.Data;
        HttpStatusCode t2 = (HttpStatusCode)data.GetType().GetProperty("code").GetValue(data, null);
        var t1 = data.GetType().GetProperties().ToList();
        if (t1[1].Name == "error")
        {
            string t4 = (string)data.GetType().GetProperty("error").GetValue(data, null);
            Assert.AreEqual("", t4);
        }
        Assert.AreEqual(HttpStatusCode.OK, t2);
    }
    [TestMethod]
    public async Task AddPost()
    {
        // Arrange
        var controller = new PostsController();
        controller.ControllerContext = new ControllerContext();
        controller.Url = new UrlHelper(new RequestContext(controller.HttpContext, new RouteData()), new RouteCollection());
        var title = "book15";
        var token = "FJw4qfEExm17U78FA3c1QBmXdt7HJ37BvZCFFKn4UIalt8C7HXm9TJ2E5EnPZ3mx";
        var genera = new int[]{ };
        var description = "book15";
        // Create a mock instance of HttpPostedFileBase
        var httpPostedFileMock = new Mock<HttpPostedFileBase>();
        httpPostedFileMock.Setup(f => f.ContentLength).Returns(6791);  // Set the content length to a random value
        httpPostedFileMock.Setup(f => f.ContentType).Returns("image/jpeg");  // Set the content type to a random value
        httpPostedFileMock.Setup(f => f.FileName).Returns("https://edit.org/images/cat/book-covers-big-2019101610.jpg");  // Set the file name to a random value

        // Set up the InputStream property with a dummy stream (optional)
        var stream = new MemoryStream();  // Create a MemoryStream or use any other stream implementation
        httpPostedFileMock.Setup(f => f.InputStream).Returns(stream);

        // Use the mock HttpPostedFileBase object in your unit test
        var image = httpPostedFileMock.Object;
        // Act
        var result = await controller.AddPost(title,token,genera,description,image) as JsonResult;

        // Assert
        object data = result.Data;
        HttpStatusCode t2 = (HttpStatusCode)data.GetType().GetProperty("code").GetValue(data, null);
        var t1 = data.GetType().GetProperties().ToList();
        if (t1.Count != 1)
        {
            string t4 = (string)data.GetType().GetProperty("error").GetValue(data, null);
            Assert.AreEqual("", t4);
        }
        Assert.AreEqual(HttpStatusCode.OK, t2);
    }

}
