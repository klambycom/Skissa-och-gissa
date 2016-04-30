defmodule Game.ServerTest do
  use ExUnit.Case

  alias Game.Server

  doctest Server

  setup do
    {:ok, room} = GenServer.start_link(Server, words: ["foo", "bar", "baz"])

    {:ok, room: room}
  end

  test "Game.Server.new should set a random word", %{room: room} do
    assert Server.word(room) != ""
  end

  test "Game.Server.new should set rounds to no more than words", %{room: room} do
    assert Server.rounds(room) == 2

    {:ok, room} = GenServer.start_link(Server, words: ["foo", "bar", "baz"], rounds: 10)
    assert Server.rounds(room) == 2
  end

  test "Game.Server.guess should change nr of rounds if the guess is correct" do
    {:ok, room} = GenServer.start_link(Server, words: ["foo", "bar", "baz"], rounds: 2)
    Server.guess(room, Server.word(room))

    assert Server.rounds(room) == 1
  end

  test "Game.Server.guess should select a new word if the guess is correct" do
    {:ok, room} = GenServer.start_link(Server, words: ["foo", "bar", "baz"], rounds: 2)
    first_word = Server.word(room)
    Server.guess(room, first_word)

    assert first_word != Server.word(room)
  end
end
