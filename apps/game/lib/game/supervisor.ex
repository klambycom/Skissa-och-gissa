defmodule Game.Supervisor do
  use Supervisor

  def add_server(words), do: Supervisor.start_child(__MODULE__, [words])

  def find_server(id) do
    Enum.find(servers, fn(child) ->
      Game.Server.id(child) == id
    end)
  end

  def delete_server(server) when is_pid(server),
    do: Supervisor.terminate_child(__MODULE__, server)

  def delete_server(id), do: id |> find_server |> delete_server

  def servers do
    __MODULE__
    |> Supervisor.which_children
    |> Enum.map(fn({_, child, _, _}) -> child end)
  end

  ###
  # Supervisor API
  ###

  def start_link,
    do: Supervisor.start_link(__MODULE__, [], name: __MODULE__)

  def init(_) do
    children = [
      worker(Game.Server, [], restart: :transient)
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end
