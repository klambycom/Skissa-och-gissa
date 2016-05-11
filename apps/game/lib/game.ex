defmodule Game do
  @moduledoc """
  Game API
  """

  use Application

  alias Game.Database.Category

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      supervisor(Game.Repo, []),
      supervisor(Game.Supervisor, [])
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end

  @doc """
  Create a game state from the category and start a new server with that state.
  """
  def create(category_id) do
  end

  @doc """
  Create a new player or move a old player to a new server.
  """
  def join(server_id, player_id) do
  end

  @doc """
  Remove the player from its server. This is done automatically when joining
  another server, and will have no effect when done manually. Only call this
  function when the player is leaving the site.
  """
  def leave(player_id) do
  end

  @doc """
  Check if the word is correct. If it is correct the player gets the score.
  """
  def guess(player_id, word) do
  end

  @doc """
  Get all server states with players and scores.
  """
  def all do
  end

  def states_from_categories do
    Game.Repo.all(Category.with_words)
    |> Enum.map(&Game.State.from_category/1)
  end
end
