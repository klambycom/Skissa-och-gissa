defmodule Game.Supervisor do
  @moduledoc """
  Manage servers/games.
  """

  use Supervisor

  @doc """
  Add a new server from a game state.

  ## Example

      iex> state = Game.State.new("Game", ["foo", "bar"])
      ...> {:ok, server} = Game.Supervisor.add_server(state)
      ...> is_pid(server)
      true
  """
  def add_server(state), do: Supervisor.start_child(__MODULE__, [state])

  @doc """
  Find a server by its id.

  ## Example

      iex> state = Game.State.new("Game", ["foo", "bar"])
      ...> {:ok, server} = Game.Supervisor.add_server(state)
      ...> id = Game.Server.id(server)
      ...> server = Game.Supervisor.find_server(id)
      ...> is_pid(server)
      true
  """
  def find_server(id) do
    Enum.find(servers, fn(child) ->
      Game.Server.id(child) == id
    end)
  end

  @doc """
  Delete a server by its id or pid.

  ## Example

  By id:

      iex> state = Game.State.new("Game", ["foo", "bar"])
      ...> {:ok, server} = Game.Supervisor.add_server(state)
      ...> id = Game.Server.id(server)
      ...> Game.Supervisor.delete_server(id)
      ...> Game.Supervisor.find_server(id)
      nil

  By pid:

      iex> state = Game.State.new("Game", ["foo", "bar"])
      ...> {:ok, server} = Game.Supervisor.add_server(state)
      ...> id = Game.Server.id(server)
      ...> Game.Supervisor.delete_server(server)
      ...> Game.Supervisor.find_server(id)
      nil
  """
  def delete_server(server) when is_pid(server),
    do: Supervisor.terminate_child(__MODULE__, server)

  def delete_server(id), do: id |> find_server |> delete_server

  @doc """
  Return all active servers.
  """
  def servers do
    __MODULE__
    |> Supervisor.which_children
    |> Enum.map(fn({_, child, _, _}) -> child end)
  end

  ###
  # Supervisor API
  ###

  @doc false
  def start_link,
    do: Supervisor.start_link(__MODULE__, [], name: __MODULE__)

  @doc false
  def init(_) do
    children = [
      worker(Game.Server, [], restart: :transient)
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end
