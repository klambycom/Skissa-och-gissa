defmodule Game.StateTest do
  use ExUnit.Case

  alias Game.State

  doctest State

  setup do
    state = State.new(
      id: 1,
      words: ["ett", "två", "tre"],
      word: "fyra",
      rounds_left: 3
    )

    {:ok, state: state}
  end

  test "Game.State.new should set id", %{state: state} do
    assert state.id == 1
  end

  test "Game.State.new should always set id" do
    assert State.new.id != nil
  end

  test "Game.State.new should set words", %{state: state} do
    assert state.words == ["ett", "två", "tre"]
  end

  test "Game.State.new should set word", %{state: state} do
    assert state.word == "fyra"
  end

  test "Game.State.new should always set word" do
    state = State.new(words: ["ett", "två", "tre"])

    assert state.word != nil
    assert length(state.words) == 2
    assert state.rounds_left == 2
  end

  test "Game.State.new should set nr of rounds left", %{state: state} do
    assert state.rounds_left == 3
  end

  test "Game.State.new should never set more rounds left than nr of words" do
    state = State.new(words: ["foo", "bar"], word: "baz", rounds_left: 10)
    assert state.rounds_left == 2
  end

  test "Game.State.new_word should set a new word", %{state: state} do
    assert State.new_word(state).word != "fyra"
  end

  test "Game.State.new_word should remove the new word from the words", %{state: state} do
    assert length(State.new_word(state).words) == 2
  end

  test "Game.State.new_word should change nr of rounds left", %{state: state} do
    assert State.new_word(state).rounds_left == 2
  end
end
