defmodule Game.ServerTest do
  use ExUnit.Case

  alias Game.Server

  doctest Server

  setup do
    state = Game.State.new("Game", "", ["foo", "bar", "baz"])
    {:ok, room} = Server.start_link(state)

    {:ok, room: room, state: state}
  end

  test "Game.Server.new should set a random word", %{room: room} do
    assert Server.word(room) != ""
  end

  test "Game.Server.guess should change nr of rounds if the guess is correct",
    %{state: state} do
      {:ok, room} = Server.start_link(%{state | rounds_left: 2})
      Server.guess(room, Server.word(room))

      assert Server.rounds(room) == 1
    end

  test "Game.Server.guess should select a new word if the guess is correct",
    %{state: state} do
      {:ok, room} = Server.start_link(%{state | rounds_left: 2})

      first_word = Server.word(room)
      Server.guess(room, first_word)

      assert first_word != Server.word(room)
    end
end
