defmodule Frontend.Router do
  use Frontend.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Frontend do
    pipe_through [:browser]

    get "/", PageController, :index

    get "/admin", AdminController, :index
    post "/admin", AdminController, :add_word
    resources "/admin/categories", CategoryController, except: [:index, :show] do
      resources "/words", WordController, only: [:index, :delete]
    end

    resources "/users", UserController
  end
end
