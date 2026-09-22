using Microsoft.AspNetCore.Mvc;
using Moq;
using UserDirectoryApi.Api.Controllers;
using UserDirectoryApi.Application.Interfaces;
using UserDirectoryApi.Contracts.Users;
using UserDirectoryApi.Domain.Entities;

namespace UserDirectoryApi.Test;

[TestClass]
public class UsersControllerTests
{
    private Mock<IUserService> _userServiceMock = null!;
    private UsersController _controller = null!;

    [TestInitialize]
    public void Setup()
    {
        _userServiceMock = new Mock<IUserService>();

        _controller = new UsersController(
            _userServiceMock.Object);
    }


    // GET: api/users
    [TestMethod]
    public async Task GetAll_ReturnsOk_WithUsers()
    {
        // Arrange
        var users = new List<User>
        {
            new User
            {
                Id = 1,
                Name = "John",
                Age = 30,
                City = "Chennai",
                State = "Tamil Nadu",
                Pincode = "600001"
            },
            new User
            {
                Id = 2,
                Name = "David",
                Age = 25,
                City = "Bangalore",
                State = "Karnataka",
                Pincode = "560001"
            }
        };

        _userServiceMock
            .Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(users);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Result as OkObjectResult;

        Assert.IsNotNull(okResult);

        var returnedUsers = okResult.Value as List<User>;

        Assert.IsNotNull(returnedUsers);
        Assert.AreEqual(2, returnedUsers.Count);
    }


    // GET: api/users/1 - Success
    [TestMethod]
    public async Task GetById_ReturnsOk_WhenUserExists()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Name = "John",
            Age = 30,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600001"
        };

        _userServiceMock
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var okResult = result.Result as OkObjectResult;

        Assert.IsNotNull(okResult);

        var returnedUser = okResult.Value as User;

        Assert.IsNotNull(returnedUser);
        Assert.AreEqual(1, returnedUser.Id);
        Assert.AreEqual("John", returnedUser.Name);
    }


    // GET: api/users/1 - Not Found
    [TestMethod]
    public async Task GetById_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        _userServiceMock
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        Assert.IsInstanceOfType<NotFoundResult>(result.Result);
    }


    // POST: api/users
    [TestMethod]
    public async Task Create_ReturnsCreatedAtAction_WhenUserIsCreated()
    {
        // Arrange
        var request = new CreateUserRequest
        {
            Name = "John",
            Age = 30,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600001"
        };

        var createdUser = new User
        {
            Id = 1,
            Name = "John",
            Age = 30,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600001"
        };

        _userServiceMock
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(createdUser);

        // Act
        var result = await _controller.Create(request);

        // Assert
        var createdResult = result.Result as CreatedAtActionResult;

        Assert.IsNotNull(createdResult);

        Assert.AreEqual(nameof(UsersController.GetById),
            createdResult.ActionName);

        Assert.AreEqual(1, createdResult.RouteValues!["id"]);

        var returnedUser = createdResult.Value as User;

        Assert.IsNotNull(returnedUser);
        Assert.AreEqual("John", returnedUser.Name);
    }


    // PUT: api/users/1 - Success
    [TestMethod]
    public async Task Update_ReturnsNoContent_WhenUserExists()
    {
        // Arrange
        var request = new UpdateUserRequest
        {
            Name = "John Updated",
            Age = 31,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600002"
        };

        _userServiceMock
            .Setup(x => x.UpdateAsync(
                1,
                It.IsAny<User>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Update(1, request);

        // Assert
        Assert.IsInstanceOfType<NoContentResult>(result);
    }


    // PUT: api/users/1 - Not Found
    [TestMethod]
    public async Task Update_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var request = new UpdateUserRequest
        {
            Name = "John",
            Age = 30,
            City = "Chennai",
            State = "Tamil Nadu",
            Pincode = "600001"
        };

        _userServiceMock
            .Setup(x => x.UpdateAsync(
                1,
                It.IsAny<User>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Update(1, request);

        // Assert
        Assert.IsInstanceOfType<NotFoundResult>(result);
    }


    // DELETE: api/users/1 - Success
    [TestMethod]
    public async Task Delete_ReturnsNoContent_WhenUserExists()
    {
        // Arrange
        _userServiceMock
            .Setup(x => x.DeleteAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(1);

        // Assert
        Assert.IsInstanceOfType<NoContentResult>(result);
    }


    // DELETE: api/users/1 - Not Found
    [TestMethod]
    public async Task Delete_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        _userServiceMock
            .Setup(x => x.DeleteAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(1);

        // Assert
        Assert.IsInstanceOfType<NotFoundResult>(result);
    }
}