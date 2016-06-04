defmodule Frontend.Router do
  use Frontend.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :browser_session do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/", Frontend do
    pipe_through [:browser, :browser_session]

    get "/", PageController, :index

    get "/sign_in", SessionController, :new
    post "/sign_in", SessionController, :create

    delete "/sign_out", SessionController, :delete

    get "/admin", AdminController, :index
    post "/admin", AdminController, :add_word
    resources "/admin/categories", CategoryController, except: [:index, :show] do
      resources "/words", WordController, only: [:index, :delete]
    end

    resources "/users", UserController
  end
end
