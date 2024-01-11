# FastAPI Fun: Building a CRUD API with a Twist!

FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints. It's easy to learn and has automatic interactive API documentation. In this guide, we will be learning FastAPI by creating a simple CRUD (Create, Read, Update, Delete) API.

## Concepts covered

**FastAPI basics**

FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It is designed to be easy to use and efficient, providing automatic validation of request and response data using Pydantic models. FastAPI also supports asynchronous programming, allowing you to write efficient and scalable code.

Here is an example of a basic FastAPI application:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

In this example, we define two routes using the `@app.get` decorator. The first route handles requests to the root URL ("/") and returns a JSON response with the message "Hello World". The second route handles requests to "/items/{item_id}" where {item_id} is a path parameter. It also accepts an optional query parameter "q". The function `read_item` takes these parameters and returns a JSON response with the provided values.

**Pydantic**

Pydantic is a library that provides runtime type checking and validation for Python data structures. It is used in FastAPI to automatically validate request and response data based on defined models. Pydantic models are defined using standard Python type hints and can include additional validation rules.

Here is an example of a Pydantic model:

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None
```

In this example, we define a Pydantic model called "Item" that has three fields: "name" of type str, "price" of type float, and "is_offer" of type bool with a default value of None. When using this model in FastAPI, the request data will be automatically validated against the defined types and any additional validation rules.

**Uvicorn**

Uvicorn is a lightning-fast ASGI server implementation, specifically designed for running Python web applications. It is the recommended server for running FastAPI applications. Uvicorn supports HTTP/1.1 and HTTP/2, as well as WebSocket protocols.

To run a FastAPI application using Uvicorn, you can use the following command:

```
uvicorn main:app --reload
```

In this command, "main" refers to the Python file containing the FastAPI application, and "app" is the name of the FastAPI instance. The "--reload" flag enables automatic reloading of the server whenever the source code changes, making development easier.

Uvicorn provides excellent performance and scalability, making it a great choice for production deployments of FastAPI applications. Project 1: Simple CRUD API

In this project, we will create a simple CRUD API using FastAPI. We will cover the basics of FastAPI, including setting up an application, defining routes, and handling requests and responses. We will also learn about Pydantic for data validation and settings management, and Uvicorn, an ASGI server, to host the FastAPI application.

### Step 1: Setting up FastAPI application

Firstly, we need to install FastAPI. We can do this using pip:

```bash
pip install fastapi
```

Next, we create a new FastAPI application. This is done by creating an instance of the `FastAPI` class:

```python
from fastapi import FastAPI

app = FastAPI()
```

### Step 2: Defining routes

In FastAPI, a route is defined using a decorator. For example, to create a route for the path `/`, we would do:

```python
@app.get("/")
def read_root():
    return {"Hello": "World"}
```

This code creates a route for `GET` requests to the path `/`. When a request is made to this path, the function `read_root` is called, and its return value is sent as the response.

### Step 3: Handling requests and responses

FastAPI provides easy ways to handle requests and responses. For example, to extract a path parameter, we can simply include it as a function parameter:

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
```

In this code, FastAPI automatically converts the path parameter `item_id` to an integer and passes it to the `read_item` function.

### Step 4: Using Pydantic for data validation

Pydantic is a data validation library that provides a way to validate input data. In FastAPI, we can use Pydantic to define the structure of request bodies and response bodies.

To install Pydantic, use pip:

```bash
pip install pydantic
```

Here's an example of how to use Pydantic to define a request body:

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None
```

### Step 5: Hosting the FastAPI application with Uvicorn

Uvicorn is an ASGI server that we can use to host our FastAPI application. To install Uvicorn, we can use pip:

```bash
pip install uvicorn
```

To run our FastAPI application, we can use the `uvicorn` command:

```bash
uvicorn main:app --reload
```

In this command, `main` is the name of the file that contains our FastAPI application (without the `.py`), and `app` is the name of the FastAPI instance.

That's it! You've now created a simple CRUD API with FastAPI. Happy coding!
