defmodule Game.RoomTest do
  use ExUnit.Case

  alias Game.Room

  doctest Room

  setup do
    {:ok, room} = Room.new(["foo", "bar", "baz"])

    {:ok, room: room}
  end

  test "Game.Room.new should set a random word", %{room: room} do
    assert Room.word(room) != ""
  end

  test "Game.Room.new should set rounds to no more than words", %{room: room} do
    assert Room.rounds(room) == 3

    {:ok, room} = Game.Room.new(["foo", "bar", "baz"], rounds: 10)
    assert Room.rounds(room) == 3
  end

  test "Game.Room.guess should change nr of rounds if the guess is correct" do
    {:ok, room} = Game.Room.new(["foo", "bar", "baz"], rounds: 2)
    Game.Room.guess(room, Game.Room.word(room))

    assert Game.Room.rounds(room) == 1
  end

  test "Game.Room.guess should select a new word if the guess is correct" do
    {:ok, room} = Game.Room.new(["foo", "bar", "baz"], rounds: 2)
    first_word = Game.Room.word(room)
    Game.Room.guess(room, first_word)

    assert first_word != Game.Room.word(room)
  end
end
