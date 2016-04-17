defmodule Game.RoomTest do
  use ExUnit.Case

  alias Game.Room

  doctest Room

  setup do
    {:ok, room} = Room.new(["foo", "bar", "baz"])

    {:ok, room: room}
  end

  test "Room.new should set a random word", %{room: room} do
    assert Room.word(room) != ""
  end
end
