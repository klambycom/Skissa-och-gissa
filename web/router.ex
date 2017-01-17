defmodule SkissaOchGissa.Router do
  use SkissaOchGissa.Web, :router

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

  scope "/", SkissaOchGissa do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index

    get "/admin", PageController, :admin
    resources "/admin/game_types", GameTypeController, except: [:index, :show] do
      get "/new", GameController, :create
    end

    get "/games/:id", GameController, :game
  end

  # Other scopes may use custom stacks.
  # scope "/api", SkissaOchGissa do
  #   pipe_through :api
  # end
end
