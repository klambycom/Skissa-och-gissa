defmodule Game.SupervisorTest do
  use ExUnit.Case

  doctest Game.Supervisor

  setup do
    on_exit fn ->
      Enum.each Game.Supervisor.servers, fn(server) ->
        Game.Supervisor.delete_server(server)
      end
    end

    state1 = Game.State.new(["ett", "tva", "tre"])
    state2 = Game.State.new(["foo", "bar", "baz"])

    {:ok, server1} = Game.Supervisor.add_server(state1)
    {:ok, server2} = Game.Supervisor.add_server(state2)

    id1 = Game.Server.id(server1)
    id2 = Game.Server.id(server2)

    {:ok, id: id1, server: server1, other_id: id2, other_server: server2}
  end

  test "Game.Supervisor.add_server adds a new supervised server" do
    counts = Supervisor.count_children(Game.Supervisor)
    assert counts.active == 2
  end

  test "Game.Supervisor.find_server gets a server by its id", %{id: id} do
    server = Game.Supervisor.find_server(id)
    assert is_pid(server)
  end

  test "Game.Supervisor.delete_server deletes a server by its id", %{id: id} do
    Game.Supervisor.delete_server(id)
    counts = Supervisor.count_children(Game.Supervisor)

    assert counts.active == 1
  end

  test "Game.Supervisor.delete_server deletes a server by its pid", %{server: server} do
    Game.Supervisor.delete_server(server)
    counts = Supervisor.count_children(Game.Supervisor)

    assert counts.active == 1
  end
end
