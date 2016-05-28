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
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/admin", AdminController, :index
    post "/admin", AdminController, :add_word
    resources "/admin/categories", CategoryController, except: [:index, :show]
  end

  # Other scopes may use custom stacks.
  # scope "/api", Frontend do
  #   pipe_through :api
  # end
end
