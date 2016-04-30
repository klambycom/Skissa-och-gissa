defmodule Game.StateTest do
  use ExUnit.Case

  alias Game.State

  doctest State

  setup do
    state = State.new(["ett", "två", "tre"])

    state2 = %State{
      id: 1,
      words: ["ett", "två", "tre"],
      word: "fyra",
      rounds_left: 3,
      players: [
        %Game.Player{},
        %Game.Player{}
      ]
    }

    {:ok, state: state, state2: state2}
  end

  test "Game.State.new should set id", %{state: state} do
    assert state.id != nil
  end

  test "Game.State.new should set words", %{state: state} do
    assert length(state.words) == 2
  end

  test "Game.State.new should set word", %{state: state} do
    assert state.word != nil
  end

  test "Game.State.new should set nr of rounds left", %{state: state} do
    assert state.rounds_left == 2
  end

  test "Game.State.new should never set more rounds left than nr of words" do
    state = State.new(["foo", "bar", "baz"], 10)
    assert state.rounds_left == 2
  end

  test "Game.State.new should set players to a empty array", %{state: state} do
    assert state.players == []
  end

  test "Game.State.new_word should set a new word", %{state: state} do
    assert State.new_word(state).word != "fyra"
  end

  test "Game.State.new_word should remove the new word from the words", %{state: state} do
    assert length(State.new_word(state).words) == 1
  end

  test "Game.State.new_word should change nr of rounds left", %{state: state} do
    assert State.new_word(state).rounds_left == 1
  end

  test "Game.State.new_word should remove 1 from rounds left" do
    state = State.new(["a", "b", "c", "d", "e"], 3)
    state = State.new_word(state)

    assert state.rounds_left == 2
  end
end
